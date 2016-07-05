

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  findNodeHandle,
  CameraRoll,
  Dimensions,
  AsyncStorage,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginKunnect from './LoginKunnect';
import TimeTable from './TimeTable';


var ViewSnapshotter = require("react-native-view-snapshot");
var screen = Dimensions.get('window');
var _ = require('underscore');

export default class SideMenu extends Component {

  constructor(props) {
    super(props);
    this._onPressLogin = this._onPressLogin.bind(this);
  }

  _onPressLogin() {

    this.props.navigator.push({
      component: LoginKunnect,
      passProps: {
        afterMount: () => {
          this.props.closeDrawer();
        },
        ...this.props
      }
    });
  }

  render() {

    var timetable;

    return (
      <View style={styles.container} ref='container'>
        <View style={styles.brand}>
          <Image
            style={styles.icon}
            source={require('../resources/brand.png')}
          />
          <Text style={styles.brandText}>황소 시간표</Text>
        </View>
        <TouchableHighlight underlayColor='#273242' onPress={this._onPressLogin}>
          <View style={styles.menu}>
            <Icon name='get-app' color='#a1acc1' size={22} />
            <Text style={styles.menuText}>시간표 불러오기</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#273242' onPress={this.props.onPressSaveTimetable}>
          <View style={styles.menu}>
            <Icon name='collections' color='#a1acc1' size={20} />
            <Text style={styles.menuText}>앨범에 저장</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#273242' onPress={this.props.onPressHeaderColorset}>
          <View style={styles.menu}>
            <Icon name='color-lens' color='#a1acc1' size={20} />
            <Text style={styles.menuText}>컬러셋</Text>
            <View style={{position: 'absolute', top: 19, right:20, borderRadius:12, width: 12, height: 12, backgroundColor:this.props.state.headerColor}}></View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor:'#303c4c'
  },
  brand : {
    height: 140,
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
  menu : {
    flexDirection : 'row',
    height: 50,
    paddingLeft: 20,
    borderBottomColor: '#232c3a',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  menuText : {
    marginLeft: 10,
    color: '#a1acc1'
  }
}
