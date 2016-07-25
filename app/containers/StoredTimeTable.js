import React, { Component } from 'react';
import {
  Dimensions,
  StatusBar,
  findNodeHandle,
  CameraRoll,
  Alert,
  PushNotificationIOS,
  NativeModules,
  ActionSheetIOS,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';

import TimeTable from '../components/TimeTable';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as appActions from '../actions/appActions';

import { getTodayTimes } from '../reducers/app/reducer';
import { setAlarmFromTimes, clearAllAlarm } from '../util/alarmManager';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

const screen = Dimensions.get('window');
const ViewSnapshotter = require('react-native-view-snapshot');
const RNFS = require('react-native-fs');
import { RNS3 } from 'react-native-aws3';
const uuid = require('uuid');

import Kakao from '../services/sns/Kakao';
import NaverLine from '../services/sns/NaverLine';

class StoredTimeTable extends Component {

  static navigatorStyle = {
    navBarHidden: true,
    navBarBackgroundColor: '#303c4c',
    navBarTextColor: '#ffffff',
    navBarButtonColor: '#ffffff'
  };

  constructor(props) {
    super(props);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.saveAppData = this.saveAppData.bind(this);
    this.toggleHeaderColorset = this.toggleHeaderColorset.bind(this);
    this.snapshotTimetable = this.snapshotTimetable.bind(this);
    this.setAlarm = this.setAlarm.bind(this);
    this.onPressTimeCell = this.onPressTimeCell.bind(this);
  }

  componentWillMount() {
    StatusBar.setBarStyle('light-content');
    StatusBar.setHidden(false, 'none');

    this._onNotification = ()=> {};
    PushNotificationIOS.addEventListener('notification', this._onNotification);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
  }

  componentDidMount() {

    const { actions } = this.props;

    PushNotificationIOS.checkPermissions(permission => {
      if (permission.alert !== 1) {
        actions.turnOffAlarm();
        this.saveAppData();
      }
    });
    GoogleAnalytics.trackScreenView('메인 화면');
  }

  setAlarm() {

    const { state, actions } = this.props;
    const { app } = state;

    switch (state.app.alarm) {
      case true :
        clearAllAlarm();
        actions.turnOffAlarm();
        Alert.alert('안내', '알람이 해제되었습니다.', [{text: '확인'}]);

        GoogleAnalytics.trackEvent('setting', 'turn off alarm');

        break;
      case false :
        PushNotificationIOS.requestPermissions()
          .then((permission)=> {
            if (permission.alert == 1) {
              setAlarmFromTimes(app.courses, app.times);
              actions.turnOnAlarm();
              this.saveAppData();
              Alert.alert('안내', '알람이 설정되었습니다.', [{text: '확인'}]);

              GoogleAnalytics.trackEvent('setting', 'turn on alarm');
            }
          })
          .catch(()=> {
            Alert.alert('안내', '알람이 설정이 실패하였습니다..', [{text: '확인'}]);
          });
        break;
    }
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    this._drawer.close();
  }

  toggleHeaderColorset() {
    this.props.actions.toggleHeaderColorset();
    this.saveAppData();

    GoogleAnalytics.trackEvent('setting', 'change colorset');
  }

  saveAppData() {
    this.props.dispatch(appActions.saveAppData());
  }

  shareTimetable(type = 'line') {

    if (this.isSavingToCameraRoll === true) {
      return;
    }
    this.isSavingToCameraRoll = true;

    var imagePath = RNFS.CachesDirectoryPath + "/temp.png";
    var ref = findNodeHandle(this.refs.timetable);
    ViewSnapshotter.saveSnapshotToPath(ref, imagePath, (error, successfulWrite) => {
      if (successfulWrite) {

        switch (type) {
          case 'line' :
            const NaverLineManager = new NaverLine();
            NaverLineManager.isLineInstalled((error, isInstalled) => {
              if(isInstalled === false) {
                Alert.alert('안내', '라인이 설치되어있지 않습니다.\n앱스토어에서 설치해주시기 바랍니다.', [{ text: '확인' }]);
                this.isSavingToCameraRoll = false;
                return;
              }
              Alert.alert('내 시간표 공유하기', 'LINE으로 이동합니다.', [{ text: '취소' },
                { text: '확인',
                  onPress: () => {
                    NaverLineManager.shareImage(imagePath);
                  } }]);
            });
            break;
          case 'kakao' :
            const KakaoManager = new Kakao();
            KakaoManager.isKakaoTalkInstalled((error, isInstalled) => {
              if(isInstalled === false) {
                Alert.alert('안내', '카카오톡이 설치되어있지 않습니다.\n앱스토어에서 설치해주시기 바랍니다.', [{ text: '확인' }]);
                this.isSavingToCameraRoll = false;
                return;
              }
              Alert.alert('내 시간표 공유하기', '카카오톡으로 이동합니다.', [{ text: '취소' },
                  { text: '확인',
                    onPress: () => {
                      KakaoManager.shareTimetableImage(imagePath);
                    } }]);
            });
            break;
        }

        this.isSavingToCameraRoll = false;
      }
    });
  }

  snapshotTimetable() {

    if (this.isSavingToCameraRoll === true) {
      return;
    }
    this.isSavingToCameraRoll = true;

    var imagePath = RNFS.CachesDirectoryPath + "/temp.png";
    var ref = findNodeHandle(this.refs.timetable);
    ViewSnapshotter.saveSnapshotToPath(ref, imagePath, (error, successfulWrite) => {
      if (successfulWrite) {
        CameraRoll.saveToCameraRoll(imagePath, 'photo').then(()=> {
          Alert.alert('안내', '카메라 앨범에 저장하였습니다.', [{text: '확인'}]);
          this.isSavingToCameraRoll = false;
        });
      }
    });
    GoogleAnalytics.trackEvent('setting', 'snapshot timetable');
  }

  onPressTimeCell(course_id) {
    this.props.navigator.showModal({
      screen: 'AddCourseContainer',
      title: '강의 수정',
      passProps: {
        course_id: course_id
      }
    });
  }

  render() {
    const { state, actions } = this.props;
    const { app } = state;

    return (
      <Drawer
        type="static"
        content={<SideMenu
          {...this.props}
          closeDrawer={this.closeDrawer}
          {...actions}
          themeColor={app.theme.header}
          onPressHeaderColorset={this.toggleHeaderColorset}
          onPressSaveTimetable={this.snapshotTimetable}
          onPressAlarm={this.setAlarm}
          onPressShareNaverLine={()=>this.shareTimetable('line')}
          onPressShareKakao={()=>this.shareTimetable('kakao')}
          alarm={app.alarm}
        />}
        openDrawerOffset={0.35}
        styles={drawerStyles}
        panOpenMask={0.3}
        tweenHandler={Drawer.tweenPresets.parallax}
        tapToClose={true}
        onOpenStart={()=> {
          StatusBar.setHidden(true, 'slide');
        }}
        onCloseStart={()=> {
          StatusBar.setHidden(false, 'slide');
        }}
        ref={(ref) => this._drawer = ref}>
        <Header
          color={app.theme.header}
          courses={app.courses}
          todayTimes={getTodayTimes(app.times)}
          onClickMenu={this.openDrawer}
        />
        <TimeTable
          colors={app.theme.cells}
          courses={app.courses}
          times={app.times}
          hands={true}
          {...actions}
          height={screen.height - 124}
          onPressCell={this.onPressTimeCell}
        />
        <TimeTable
          colors={app.theme.cells}
          courses={app.courses}
          times={app.times}
          hands={false}
          {...actions}
          style={{position: 'absolute', top: 0, left: 0, width: screen.width}}
          ref='timetable'
        />
      </Drawer>
    );
  }
}

export default connect(state => ({
    state: state
  }),
  (dispatch) => ({
    dispatch: dispatch,
    actions: bindActionCreators(appActions, dispatch)
  })
)(StoredTimeTable);


const drawerStyles = {
  main: {shadowColor: '#000000', shadowOpacity: 0.6, shadowRadius: 5},
};
