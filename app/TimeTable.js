
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
var screen = Dimensions.get('window');

const tableHeadHeight = 32;
const tabeRowHeight = 44;
const daysWidth = screen.width - 25;
const oneDayWidth = daysWidth / 5;

class TimeTable extends Component {

    constructor(props) {
      super(props);
    }

    _getLeftPosition(time) {

      switch(time.day) {
        case 'MON' :
          return 25;
        break;
        case 'TUE' :
          return 25 + oneDayWidth;
        break;
        case 'WED' :
          return 25 + oneDayWidth*2;
        break;
        case 'THU' :
          return 25 + oneDayWidth*3;
        break;
        case 'FRI' :
          return 25 + oneDayWidth*4;
        break;
        case 'SAT' :
          return 25 + oneDayWidth*5;
        break;
      }
    }

    _getTopPosition(time) {
      var time = time.start.split(':');
      var hour = time[0],
          minute = time[1];
      return (hour - 8)*tabeRowHeight + (minute/60)*tabeRowHeight;
    }

    _getCourseHeight(time) {

      if(!time.start || !time.end) return 0;

      var minute, hour,
          start = time.start.split(':'),
          end = time.end.split(':'),
          s_hour = Number(start[0]),
          s_minute = Number(start[1]),
          e_hour = Number(end[0]),
          e_minute = Number(end[1]);

      if( s_minute > e_minute ) {
        e_minute = e_minute + 60;
        e_hour--;
      }

      minute = e_minute - s_minute;
      hour = e_hour - s_hour;
      return (hour + (minute/60))*tabeRowHeight;
    }

    render() {

      var tableHeight = this.props.height - tableHeadHeight;
      var courses = (this.props.courses) ? Object.keys(this.props.courses).map(key => this.props.courses[key]) : [];

      return (
        <View>
          <View style={styles.tableHead}>
            <View style={[styles.tableTimeColumn, {height: tableHeadHeight-1}]}></View>
            <Text style={[styles.tableHeadText, {flex:3}]}>MON</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>TUE</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>WED</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>THU</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>FRI</Text>
          </View>
          <ScrollView automaticallyAdjustContentInsets={false} style={{height: tableHeight}}>
          {[...Array(12)].map((x, i) =>
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableTimeColumn}>
                <Text style={styles.tableTimeText}>{i+8}</Text>
              </View>
              <View style={styles.tableColumn}></View>
              <View style={styles.tableColumn}></View>
              <View style={styles.tableColumn}></View>
              <View style={styles.tableColumn}></View>
              <View style={[styles.tableColumn, {borderRightWidth: 0}]}></View>
            </View>
          )}

          {[...courses].map((course, i) =>
            [...course.times].map((time, j)=>
            <TouchableHighlight onPress={()=>{}} style={{position: 'absolute', left: this._getLeftPosition(time), top:this._getTopPosition(time)}}  key={i+'-'+j}>
              <View condition={false} style={[styles.course, {backgroundColor: colors[i][0], height:this._getCourseHeight(time)}]}>
                <Text style={{fontSize: 12, color:colors[i][1], textAlign: 'center'}}>
                {course.subject}
                </Text>
                <Text style={{fontSize: 11, color:colors[i][1], textAlign: 'center', marginTop: 2}}>
                {course.classroom}
                </Text>
              </View>
            </TouchableHighlight>
            )
          )}
          </ScrollView>
        </View>
      );
    }
}
module.exports = TimeTable;

const colors = [
  ['#e9787c', 'white'], //빨간색
  ['#bde7f3', '#43839c'], //파란색
  ['#F6FC97', '#5A6000'], //연초록
  ['#eb8a9e', 'white'], //분홍색
  ['#d2b579', 'white'], //베이지
  ['#ddcdf4', '#8b48dc'], //보라색
  ['#fff099', '#8c7118'], //노란색
];

const styles = StyleSheet.create({
  course : {
    position: 'absolute',
    width: oneDayWidth,
    left:0,
    top: 0,
    backgroundColor:'#ff4e48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHead : {
    flexDirection: 'row',
    borderBottomColor: '#d0d0d0',
    borderBottomWidth: 1,
    height: tableHeadHeight,
    alignItems: 'center'
  },
  tableHeadText: {
    color:'#999999',
    fontSize: 11,
    fontWeight: '300',
    textAlign: 'center'
  },
  tableRow : {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  tableColumn : {
    flex: 3,
    height: 44,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  tableTimeColumn: {
    backgroundColor: '#f5f5f5',
    width: 25,
    paddingTop: 3,
    paddingRight: 3,
  },
  tableTimeText : {
    color: '#999999',
    fontSize: 11,
    fontWeight: '300',
    textAlign: 'right'
  }
});
