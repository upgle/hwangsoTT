
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
import diff from 'deep-diff';
import Icon from 'react-native-vector-icons/MaterialIcons';
var screen = Dimensions.get('window');

const tableHeadHeight = 32;
const tabeRowHeight = 44;
const daysWidth = screen.width - 25;
const oneDayWidth = daysWidth / 5;

export default class TimeTable extends Component {

    constructor(props) {
      super(props);
    }

    shouldComponentUpdate(nextProps) {
      if(diff(this.props.courses, nextProps.courses)) {
        return true;
      }
      if(diff(this.props.times, nextProps.times)) {
        return true;
      }
      return false;
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

    _getHandsLeftPosition() {
      var date = new Date();
      var day = date.getDay();
      return 25 + oneDayWidth*(day-1);
    }

    _getHandsTopPosition() {
      var date = new Date();
      var hour = date.getHours();
      var minute = date.getMinutes();
      return (hour - 8)*tabeRowHeight + (minute/60)*tabeRowHeight;
    }

    render() {

      const tableHeight = this.props.height - tableHeadHeight;
      const { courses, times } = this.props;

      var autoincrement = 0;
      var colorMap = {};

      var timeTableBody = (
        <View>
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
        {[...times].map((time, i)=> {
          var index;
          if(colorMap[time.course_id]) {
            index = colorMap[time.course_id];
          }
          else {
            index = colorMap[time.course_id] = autoincrement++
          }
          return (
            <TouchableHighlight onPress={()=>{}} style={{position: 'absolute', left: this._getLeftPosition(time), top:this._getTopPosition(time)}}  key={i}>
              <View condition={false} style={[styles.course, {backgroundColor: colors[index][0], height:this._getCourseHeight(time)}]}>
                <Text style={{fontSize: 12, color:colors[index][1], textAlign: 'center'}}>
                {courses[time.course_id].subject}
                </Text>
                <Text style={{fontSize: 11, color:colors[index][1], textAlign: 'center', marginTop: 2}}>
                {courses[time.course_id].classroom}
                </Text>
              </View>
            </TouchableHighlight>
          );
        })}
        <View style={{
          position: 'absolute',
          opacity: 0.35,
          width: oneDayWidth,
          height:2,
          backgroundColor: 'red',
          left: this._getHandsLeftPosition(),
          top : this._getHandsTopPosition()
        }}></View>
        </View>
      );

      return (
        <View style={styles.container}>
          <View style={styles.tableHead}>
            <View style={[styles.tableTimeColumn, {height: tableHeadHeight-1}]}></View>
            <Text style={[styles.tableHeadText, {flex:3}]}>MON</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>TUE</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>WED</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>THU</Text>
            <Text style={[styles.tableHeadText, {flex:3}]}>FRI</Text>
          </View>
          <ScrollView automaticallyAdjustContentInsets={false} style={{height: tableHeight}}>
            {timeTableBody}
          </ScrollView>
        </View>
      );
    }
}

const colors = [
  ['#E9787C', '#FFFFFF'], //빨간색
  ['#BDE7F3', '#43839c'], //파란색
  ['#F6FC97', '#5A6000'], //연초록
  ['#EB8A9E', '#FFFFFF'], //분홍색
  ['#D2B579', '#FFFFFF'], //베이지
  ['#DDCDF4', '#8b48dc'], //보라색
  ['#FFF099', '#8c7118'], //노란색
  ['#67686C', '#FFFFFF'],
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
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
