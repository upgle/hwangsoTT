
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
  AsyncStorage
} from 'react-native';
import _ from 'underscore';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TimeTable from './TimeTable';


var screen = Dimensions.get('window');

const headerHeight = 124;

class TimeTableWithHeader extends Component {

    constructor(props) {
      super(props);
      this.state = {
        courses : {},
        isLoaded : false,
        headerSelected : false,
      }
      this._toggleHeaderSelected = this._toggleHeaderSelected.bind(this);
    }

    componentDidMount() {
      AsyncStorage.getItem('courses', (err, result) => {
        if(_.isObject(JSON.parse(result))) {
          this.setState({
            courses: JSON.parse(result),
          });
        }
        this.setState({
          isLoaded: true
        });
      });
    }

    _toggleHeaderSelected() {
      this.setState({
        headerSelected : !this.state.headerSelected
      });
    }

    _getHeaderTextDOM() {

      if(!this.state.isLoaded) return null;

      // 시간표 객체가 없을때
      if(_.size(this.state.courses) == 0) {
        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.headerBigText}>시간표가 없습니다</Text>
            <Text style={styles.headerSmallText}>동기화를 먼저 진행해주세요.</Text>
          </View>
        );
      }

      if(this._isNoClassToday()) {
        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.headerBigText}>오늘 수업 없음</Text>
            <Text style={styles.headerSmallText}>오늘은 수업이 없습니다.</Text>
          </View>
        );
      }

      if(this._isFinishTodayClass()) {
        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.headerBigText}>오늘 수업 끝</Text>
            <Text style={styles.headerSmallText}>모든 수업이 종료되었습니다.</Text>
          </View>
        );
      }

      var next = this._getNextCourse();
      var temp = next.time.start.split(':');
      var hour = Number(temp[0]);
      var minute = Number(temp[1]);

      var today = new Date();
      var date1 = new Date(2000, 0, 1, today.getHours(), today.getMinutes());
      var date2 = new Date(2000, 0, 1, hour, minute);

      var diff = date2 - date1;
      var msec = diff;
      var hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.floor(msec / 1000);
      msec -= ss * 1000;

      var leftTime = '';
      if(hh > 0) {
        leftTime = hh + '시간 ';
      }
      leftTime += mm + '분 남음';

      return (
        <TouchableOpacity activeOpacity={0.8} onPress={this._toggleHeaderSelected}>
            <Text style={styles.headerSmallText}>다음수업</Text>
            <Text style={styles.headerBigText}>{(this.state.headerSelected) ? next.course.classroom : next.course.subject}</Text>
            <Text style={styles.headerSmallText2}>{leftTime}</Text>
        </TouchableOpacity>
      );
    }

    _getNextCourse() {
      var courses = this.state.courses;

      var minTime = null;
      var closetCourse = null,
          closetTime = null;

      Object.keys(courses).forEach((key)=>{
        var course = courses[key];
        course.times.forEach(time =>{
          if(time.day == this._getTodayString()) {
            var timeNumberFormat = Number(time.start.replace(':',''))

            if(minTime == null || minTime > timeNumberFormat) {
              minTime = timeNumberFormat;
              closetCourse = course;
              closetTime = time;
            }
          }
        });
      });
      return {
        course : closetCourse,
        time : closetTime
      };
    }

    _getTodayString() {
      var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      var date = new Date();
      return days[date.getDay()];
    }

    _isNoClassToday() {
      var courses = this.state.courses;
      return !Object.keys(courses).some((key) => {
        var course = courses[key];
        return course.times.some(time => {
          return (time.day == this._getTodayString());
        })
      });
    }

    _isFinishTodayClass() {
      var courses = this.state.courses;
      var date = new Date();
      var current = Number(String(date.getHours())+date.getMinutes());
      return Object.keys(courses).some((key) => {
        var course = courses[key];
        return course.times.some(time => {
          if (time.day == this._getTodayString() && current > Number(time.end.replace(':',''))) {
            return true;
          }
          return false;
        })
      });
    }

    render() {

      var TextArea = this._getHeaderTextDOM();

      return (
        <View style={{backgroundColor:'white', flexDirection:'column'}}>
          <View style={styles.header}>
            {TextArea}
            <TouchableOpacity style={styles.menuPosition} onPress={this.props.onClickMenu}>
              <View style={styles.menuView}>
                <Icon name='menu' color='#e9fffc' size={28} />
              </View>
            </TouchableOpacity>
          </View>
          <TimeTable height={screen.height - headerHeight} courses={this.state.courses} />
        </View>
      );
    }
}

module.exports = TimeTableWithHeader;

const styles = StyleSheet.create({
  menuPosition: {
    position: 'absolute', top: 0, left: 0
  },
  menuView: {
    paddingTop: 27,
    paddingLeft: 16,
    paddingRight: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems : 'center',
  },
  menuText: {
    marginLeft: 3,
    fontSize: 15,
    color:'white',
  },
  header : {
    paddingTop : 40,
    backgroundColor: '#3ebfba',
    height: headerHeight,
  },
  headerBigText: {
    color: 'white',
    fontSize: 25,
    height: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerSmallText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '200',
    textAlign: 'center'
  },
  headerSmallText2: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  },
});
