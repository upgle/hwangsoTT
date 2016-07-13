
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import _ from 'underscore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimerMixin from 'react-timer-mixin';


const headerHeight = 124;

export default class Header extends Component {

    constructor(props) {
      super(props);
      this.state = {
        courses : {},
        headerSelected : false,
      };
      this._toggleHeaderSelected = this._toggleHeaderSelected.bind(this);
    }

    componentDidMount() {
      this.timer = TimerMixin.setInterval(
        () => {
          this.forceUpdate();
        },
        5000
      );
    }

    componentWillUnmount() {
      TimerMixin.clearInterval(this.timer);
    }

    _toggleHeaderSelected() {
      this.setState({
        headerSelected : !this.state.headerSelected
      });
    }

    _getHeaderTextDOM() {

      // 시간표 객체가 없을때
      if(_.size(this.props.courses) === 0) {
        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.headerBigText}>시간표가 없습니다</Text>
            <Text style={styles.headerSmallText}>동기화를 먼저 진행해주세요.</Text>
          </View>
        );
      }

      if(this.props.todayTimes.length === 0) {
        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.headerBigText}>수업 없음</Text>
            <Text style={styles.headerSmallText}>오늘은 수업이 없는 날입니다.</Text>
          </View>
        );
      }

      if(this._isFinishTodayClass()) {
        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.headerBigText}>수업 끝남</Text>
            <Text style={styles.headerSmallText}>모든 수업이 종료되었습니다.</Text>
          </View>
        );
      }

      var next = this._getNextCourse();
      var leftTime = '';

      if(next.inClass) {
        leftTime = '수업 중';
      } else {
        if(next.leftHour > 0) {
          leftTime = next.leftHour + '시간 ';
        }
        if(next.leftMinute > 0 ) {
          leftTime += next.leftMinute + '분 남음';
        }
      }

      return (
        <TouchableOpacity activeOpacity={0.8} onPress={this._toggleHeaderSelected}>
            <Text style={styles.headerSmallText}>다음수업</Text>
            <Text style={styles.headerBigText}>{(this.state.headerSelected) ? this.props.courses[next.time.course_id].classroom : this.props.courses[next.time.course_id].subject}</Text>
            <Text style={styles.headerSmallText2}>{leftTime}</Text>
        </TouchableOpacity>
      );
    }

    _getNextCourse() {

      const { todayTimes }  = this.props;

      var today = new Date();
      var currentTime = new Date(2000, 0, 1, today.getHours(), today.getMinutes());

      var minTime = null;
      var closetTime = null;
      var diffTime = null;

      for (var i = 0; i < todayTimes.length; i++) {

        var time = todayTimes[i],
            start = time.start.split(':'),
            end = time.end.split(':');

        var startTime = new Date(2000, 0, 1, start[0], start[1]);
        var endTime = new Date(2000, 0, 1, end[0], end[1]);

        if(currentTime > endTime) {
          continue;
        }

        if(minTime === null || minTime > endTime) {
          minTime = endTime;
          closetTime = time;
          diffTime = startTime - currentTime;
        }
      }

      var msec = diffTime;
      var hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.floor(msec / 1000);
      msec -= ss * 1000;

      return {
        time : closetTime,
        leftHour : hh,
        leftMinute : mm,
        leftSecond : ss,
        inClass : (hh < 0)
      };
    }

    _isFinishTodayClass() {
      return this._getNextCourse().time === null;
    }

    render() {
      var TextArea = this._getHeaderTextDOM();
      return (
        <View style={[styles.header, { backgroundColor : this.props.color }]}>
          {TextArea}
          <TouchableOpacity style={styles.menuPosition} onPress={this.props.onClickMenu}>
            <View style={styles.menuView}>
              <Icon name='menu' color='#E9FFFC' size={28} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
}


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
    // backgroundColor: '#3ebfba',
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
