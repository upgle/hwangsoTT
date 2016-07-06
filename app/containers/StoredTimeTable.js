
import React, { Component } from 'react';
import {
  Dimensions,
  StatusBar,
  findNodeHandle,
  CameraRoll,
  Alert,
  PushNotificationIOS
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';

import TimeTable from '../components/TimeTable';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as Actions from '../actions/appActions';

import {getTodayTimes} from '../reducers/timetableApp';
var ViewSnapshotter = require("react-native-view-snapshot");
var RNFS = require('react-native-fs');
import { setAlarmFromTimes } from '../util/alarmManager';

var screen = Dimensions.get('window');

class StoredTimeTable extends Component {
  constructor(props) {
    super(props);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.saveAppData = this.saveAppData.bind(this);
    this.toggleHeaderColorset = this.toggleHeaderColorset.bind(this);
    this.snapshotTimetable = this.snapshotTimetable.bind(this);
    this.setAlarm = this.setAlarm.bind(this);
  }

  componentDidMount() {

    const { actions } = this.props;

    StatusBar.setBarStyle('light-content');
    StatusBar.setHidden(false, 'none');

    PushNotificationIOS.checkPermissions(permission => {
      if(permission.alert !== 1) {
        actions.turnOffAlarm();
        this.saveAppData();
      }
    });
  }

  setAlarm() {
    const { state, actions } = this.props;
    PushNotificationIOS.checkPermissions(permission => {
      if(permission.alert == 1) {
        setAlarmFromTimes(state.courses, state.times);
        actions.turnOnAlarm();
        this.saveAppData();
        Alert.alert('안내', '알람이 설정되었습니다.', [{text: '확인'}]);
      }
    });
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
  }

  saveAppData() {
    this.props.dispatch(Actions.saveAppData());
  }

  snapshotTimetable() {
    var imagePath = RNFS.CachesDirectoryPath+"/temp.png";
    var ref = findNodeHandle(this.refs.timetable);
    ViewSnapshotter.saveSnapshotToPath(ref, imagePath, (error, successfulWrite) => {
      if (successfulWrite) {
        CameraRoll.saveImageWithTag(imagePath).then(()=>{
          Alert.alert('안내', '카메라 앨범에 저장하였습니다.', [{text: '확인'}]);
        });
      }
    });
  }

  render() {
    const { state, actions } = this.props;

    return (
      <Drawer
      type="static"
      content={<SideMenu
                  {...this.props}
                  closeDrawer={this.closeDrawer}
                  {...actions}
                  onPressHeaderColorset={this.toggleHeaderColorset}
                  onPressSaveTimetable={this.snapshotTimetable}
                  onPressAlarm={this.setAlarm}
                  alarm={state.alarm}
                />}
      openDrawerOffset={0.4}
      styles={drawerStyles}
      panOpenMask={0.45}
      tweenHandler={Drawer.tweenPresets.parallax}
      tapToClose={true}
      onOpenStart={()=>{
        StatusBar.setHidden(true, 'slide');
      }}
      onCloseStart={()=>{
        StatusBar.setHidden(false, 'slide');
      }}
      ref={(ref) => this._drawer = ref} >
        <Header
          color={state.headerColor}
          courses={state.courses}
          todayTimes={getTodayTimes(state.times)}
          onClickMenu={this.openDrawer}
        />
        <TimeTable
          courses={state.courses}
          times={state.times}
          {...actions}
          height={screen.height - 124}
        />

        <TimeTable
          courses={state.courses}
          times={state.times}
          {...actions}
          style={{position:'absolute', top:0, left:0, width: screen.width}}
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
    actions: bindActionCreators(Actions, dispatch)
  })
)(StoredTimeTable);


const drawerStyles = {
  main: {shadowColor: '#000000', shadowOpacity: 0.6, shadowRadius: 5},
};
