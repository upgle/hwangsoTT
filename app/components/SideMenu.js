import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  NetInfo,
  Alert,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import I18n from 'react-native-i18n';

export default class SideMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
    };
    this.onPressAddCourse = this.onPressAddCourse.bind(this);
    this.onPressLogin = this.onPressLogin.bind(this);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this.handleConnectivityChange
    );
  }

  onPressAddCourse() {
    this.props.navigator.showModal({
      screen: 'AddCourseContainer',
      title: I18n.t('addLesson'),
    });
  }

  onPressLogin() {
    if (this.state.isConnected) {
      this.props.navigator.showModal({
        screen: 'ImporterContainer',
        title: I18n.t('loadTimetable'),
      });
    } else {
      Alert.alert('안내', '시간표 불러오기는 네트워크가 연결된 환경에서만 사용하실 수 있습니다.');
    }
  }

  handleConnectivityChange(isConnected) {
    this.setState({
      isConnected,
    });
  }

  render() {
    const { state } = this.props;

    let notiStatus;
    if (state.app.alarm) {
      notiStatus = (<View style={{position: 'absolute', width: 42, right: 20, top: 15, borderRadius:13, borderColor:'#c9d9f4', borderWidth: 1, paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2}}><Text style={{color:'#c9d9f4', fontSize: 12, textAlign: 'center'}}>ON</Text></View>);
    } else {
      notiStatus = (<View style={{position: 'absolute', width: 42, right: 20, top: 15, borderRadius:13, borderColor:'#8f9aad', borderWidth: 1, paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2}}><Text style={{color:'#8f9aad', fontSize: 12, textAlign: 'center'}}>OFF</Text></View>);
    }

    return (
      <View style={styles.container} ref='container'>
        <View style={styles.brand}>
          <Image
            source={require('../resources/brand.png')}
          />
        </View>
        <TouchableHighlight underlayColor={styles.menuUnderlayColor} onPress={this.onPressAddCourse}>
          <View style={styles.menu}>
            <Ionicon name='md-add-circle' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>{I18n.t('addLesson')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={styles.menuUnderlayColor} onPress={this.onPressLogin}>
          <View style={styles.menu}>
            <Ionicon name='md-cloud' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>{I18n.t('loadTimetable')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={styles.menuUnderlayColor} onPress={this.props.onPressSaveTimetable}>
          <View style={styles.menu}>
            <Ionicon name='md-image' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>{I18n.t('saveToAlbum')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={styles.menuUnderlayColor} onPress={this.props.onPressHeaderColorset}>
          <View style={styles.menu}>
            <Ionicon name='md-color-palette' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>{I18n.t('themeStore')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={styles.menuUnderlayColor} onPress={this.props.onPressAlarm}>
          <View style={styles.menu}>
            <Ionicon name='md-notifications' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>{I18n.t('lessonNotification')}</Text>
            {notiStatus}
          </View>
        </TouchableHighlight>
        <View style={{ padding: 20, alignItems: 'center', marginTop: 5 }}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ color: 'rgba(175, 188, 212, 0.5)', fontSize: 10.5, fontWeight:'100' }}>Share with Friends</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={this.props.onPressShareNaverLine}>
              <Image source={require('../resources/naver_line.png')} style={{ width: 35, height: 35, borderRadius: 17.5 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onPressShareKakao}>
              <Image source={require('../resources/kakao.png')} style={{ width: 35, height: 35, borderRadius: 17.5, marginLeft: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onPressShareFacebook}>
              <Image source={require('../resources/facebook.png')} style={{ width: 35, height: 35, borderRadius: 17.5, marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#202830',
  },
  brand: {
    height: 124,
    borderBottomColor: '#171e23',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontWeight: 'bold',
    marginTop: 14,
    color: '#818b9c',
  },
  icon: {
    width: 33,
  },
  menu: {
    flexDirection: 'row',
    height: 54,
    paddingLeft: 20,
    borderBottomColor: '#171e23',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  menuUnderlayColor: '#242d36',
  menuText: {
    color: '#c9d9f4',
    fontSize: 13.5,
  },
};

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;
I18n.translations = {
  en: {
    addLesson: 'Add lesson',
    loadTimetable: 'Load timetable',
    saveToAlbum: 'Save to album',
    themeStore: 'Theme Store',
    lessonNotification: 'Notification',
  },
  ko: {
    addLesson: '강의 추가',
    loadTimetable: '시간표 불러오기',
    saveToAlbum: '앨범에 저장',
    themeStore: '테마 스토어',
    lessonNotification: '수업 알림',
  },
};
