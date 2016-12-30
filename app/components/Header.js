import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
} from 'react-native';
import _ from 'underscore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimerMixin from 'react-timer-mixin';

const headerHeight = 124;

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: {},
      headerSelected: false,
    };
    this.toggleHeaderSelected = this.toggleHeaderSelected.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.unsetTimer = this.unsetTimer.bind(this);
  }

  componentWillMount() {
    this.setTimer();
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    this.unsetTimer();
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }

  setTimer() {
    this.timer = TimerMixin.setInterval(
      () => {
        this.forceUpdate();
      },
      5000 // 1minute
    );
  }

  handleAppStateChange(event) {
    if (event === 'active') {
      this.forceUpdate();
      this.setTimer();
    }
    if (event === 'inactive') {
      this.unsetTimer();
    }
  }

  toggleHeaderSelected() {
    this.setState({
      headerSelected: !this.state.headerSelected
    });
  }

  getHeaderTextDOM() {

    // 시간표 객체가 없을때
    if (_.size(this.props.courses) === 0) {
      return (
        <View style={{marginTop: 10}}>
          <Text style={styles.headerBigText}>시간표가 없습니다</Text>
          <Text style={styles.headerSmallText}>먼저 강의를 등록해주세요.</Text>
        </View>
      );
    }

    if (this.props.todayTimes.length === 0) {
      return (
        <View style={{marginTop: 10}}>
          <Text style={styles.headerBigText}>수업 없음</Text>
          <Text style={styles.headerSmallText}>오늘은 수업이 없는 날입니다.</Text>
        </View>
      );
    }

    if (this.isFinishTodayClass()) {
      return (
        <View style={{marginTop: 10}}>
          <Text style={styles.headerBigText}>수업 종료</Text>
          <Text style={styles.headerSmallText}>모든 수업이 종료되었습니다.</Text>
        </View>
      );
    }

    const next = this.getNextCourse();
    let leftTime = '';

    if (next.inClass) {
      leftTime = '수업 중';
    } else {
      if (next.leftHour > 0) {
        leftTime = next.leftHour + '시간 ';
      }
      if (next.leftMinute > 0) {
        leftTime += next.leftMinute + '분 남음';
      }
    }

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.toggleHeaderSelected}>
        <Text style={styles.headerSmallText}>다음수업</Text>
        <Text
          style={styles.headerBigText}>{(this.state.headerSelected) ? this.props.courses[next.time.course_id].classroom : this.props.courses[next.time.course_id].subject}</Text>
        <Text style={styles.headerSmallText2}>{leftTime}</Text>
      </TouchableOpacity>
    );
  }

  getNextCourse() {
    const { todayTimes }  = this.props;

    const today = new Date();
    const currentTime = new Date(2000, 0, 1, today.getHours(), today.getMinutes());

    let minTime = null;
    let closetTime = null;
    let diffTime = null;

    for (let i = 0; i < todayTimes.length; i++) {

      var time = todayTimes[i],
        start = time.start.split(':'),
        end = time.end.split(':');

      var startTime = new Date(2000, 0, 1, start[0], start[1]);
      var endTime = new Date(2000, 0, 1, end[0], end[1]);

      if (currentTime > endTime) {
        continue;
      }

      if (minTime === null || minTime > endTime) {
        minTime = endTime;
        closetTime = time;
        diffTime = startTime - currentTime;
      }
    }

    let msec = diffTime;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return {
      time: closetTime,
      leftHour: hh,
      leftMinute: mm,
      leftSecond: ss,
      inClass: (hh < 0),
    };
  }

  unsetTimer() {
    TimerMixin.clearInterval(this.timer);
  }

  isFinishTodayClass() {
    return this.getNextCourse().time === null;
  }

  render() {
    const TextArea = this.getHeaderTextDOM();
    return (
      <View style={[styles.header, {backgroundColor: this.props.color}]}>
        {TextArea}
        <TouchableOpacity style={styles.menuPosition} onPress={this.props.onClickMenu}>
          <View style={styles.menuView}>
            <Icon name="menu" color="#E9FFFC" size={28} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  menuPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  menuView: {
    paddingTop: 27,
    paddingLeft: 16,
    paddingRight: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 3,
    fontSize: 15,
    color: 'white',
  },
  header: {
    paddingTop: 35,
    height: headerHeight,
  },
  headerBigText: {
    color: 'white',
    fontSize: 24,
    height: 30,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerSmallText: {
    color: 'white',
    paddingTop: 3,
    fontSize: 13,
    fontWeight: '200',
    textAlign: 'center',
  },
  headerSmallText2: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});
