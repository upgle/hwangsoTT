import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class SideMenu extends Component {

  constructor(props) {
    super(props);

    this.onPressAddCourse = this.onPressAddCourse.bind(this);
    this.onPressLogin = this.onPressLogin.bind(this);
  }

  onPressAddCourse() {
    this.props.navigator.showModal({
      screen: 'AddCourseContainer',
      title: '강의 추가',
    });
  }

  onPressLogin() {
    this.props.navigator.showModal({
      screen: 'ImporterContainer',
      title: '시간표 불러오기',
    });
  }

  render() {
    const { state } = this.props;

    let notiStatus;
    if(state.app.alarm) {
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
        <TouchableHighlight underlayColor='#273242' onPress={this.onPressAddCourse}>
          <View style={styles.menu}>
            <Ionicon name='md-add-circle' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>강의 추가</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#273242' onPress={this.onPressLogin}>
          <View style={styles.menu}>
            <Ionicon name='md-cloud' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>시간표 불러오기</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#273242' onPress={this.props.onPressSaveTimetable}>
          <View style={styles.menu}>
            <Ionicon name='md-image' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>앨범에 저장</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#273242' onPress={this.props.onPressHeaderColorset}>
          <View style={styles.menu}>
            <Ionicon name='md-color-palette' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>컬러셋</Text>
            <View style={{position: 'absolute', top: 20, right:20, borderRadius:12, width: 12, height: 12, backgroundColor:this.props.themeColor}}></View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#273242' onPress={this.props.onPressAlarm}>
          <View style={styles.menu}>
            <Ionicon name='md-notifications' color='#c9d9f4' size={22} style={styles.icon} />
            <Text style={styles.menuText}>수업 알림</Text>
            {notiStatus}
          </View>
        </TouchableHighlight>
        <View style={{ padding: 20, alignItems: 'center', marginTop: 5 }}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ color: 'rgba(175, 188, 212, 0.5)', fontSize: 10.5, fontWeight:'100' }}>Share with Friends</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={this.props.onPressShareNaverLine}>
              <Image source={require('../resources/naver_line.png')} style={{ width: 35, height: 35 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onPressShareKakao}>
              <Image source={require('../resources/kakao.png')} style={{ width: 35, height: 35, marginLeft: 6 }} />
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
    backgroundColor:'#303c4c',
  },
  brand: {
    height: 124,
    borderBottomColor: '#232c3a',
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
    flexDirection : 'row',
    height: 54,
    paddingLeft: 20,
    borderBottomColor: '#232c3a',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  menuText: {
    color: '#c9d9f4',
    fontSize: 13.5,
  },
};
