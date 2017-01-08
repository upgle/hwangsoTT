import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native';

import Header from './time-selector/Header';
import DaySelector from './time-selector/DaySelector';
import TimePicker from './time-selector/TimePicker';
import I18n from '../I18n';

export default class AddTime extends Component {

  constructor(props) {
    super(props);

    this.state = {

      days: [],

      // year, month, day, hours, minutes, seconds, milliseconds
      startDate: new Date(2016, 1, 1, 8, 0, 0, 0),
      endDate: new Date(2016, 1, 1, 10, 0, 0, 0),

      view: 'default',
    };
    this.onPressDone = this.onPressDone.bind(this);
    this.onPressStartTime = this.onPressStartTime.bind(this);
    this.onPressEndTime = this.onPressEndTime.bind(this);
    this.onPressModifyCancle = this.onPressModifyCancle.bind(this);
    this.onPressModifyConfirm = this.onPressModifyConfirm.bind(this);
    this.onPressDayButton = this.onPressDayButton.bind(this);
  }

  onPressStartTime() {
    this.setState({ view: 'modifyStartTime' });
  }

  onPressDone() {
    const start = this.zeroPad(this.state.startDate.getHours()) + ':' + this.zeroPad(this.state.startDate.getMinutes());
    const end = this.zeroPad(this.state.endDate.getHours()) + ':' + this.zeroPad(this.state.endDate.getMinutes());

    if (this.state.days.length === 0) {
      Alert.alert(
        '안내',
        '요일을 1개 이상 선택해주세요',
        [{ text: '확인' }]
      );
      return;
    }
    if (this.state.startDate.getTime() >= this.state.endDate.getTime()) {
      Alert.alert(
        '안내',
        '종료 시각은 시작 시각보다 뒤에 있어야 합니다',
        [{ text: '확인' }]
      );
      return;
    }
    this.props.onPressDone({ days: this.state.days, start, end });
  }

  onPressEndTime() {
    this.setState({ view: 'modifyEndTime' });
  }

  onPressModifyCancle() {
    this.setState({ view: 'default' });
  }

  onPressModifyConfirm(date) {
    switch (this.state.view) {
      case 'modifyStartTime' :
        this.setState({
          view: 'default',
          startDate: date,
          endDate: (date.getTime() > this.state.endDate.getTime()) ? date : this.state.endDate
        });
        break;

      case 'modifyEndTime' :
        this.setState({
          view: 'default',
          endDate: date,
        });
        break;
    }
  }

  onPressDayButton(day) {
    const index = this.state.days.indexOf(day);
    const days = this.state.days.slice();

    if (index < 0) {
      days.push(day);
    } else {
      days.splice(index, 1);
    }
    this.setState({ days });
  }

  getDateToString(date) {
    let str = '오후 ';

    if (date.getHours() < 12) {
      str = '오전 ';
    }
    let hours = date.getHours();
    if (hours !== 12) {
      hours = date.getHours() % 12;
    }
    str += this.zeroPad(hours);
    str += ':';
    str += this.zeroPad(date.getMinutes());
    return str;
  }

  zeroPad(nr, base = 10) {
    const len = (String(base).length - String(nr).length) + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
  }

  render() {
    let view = (
      <View style={{flex: 1}}>
        <Header text={I18n.t('courseDayOfTheWeek')} />
        <DaySelector onPressButton={this.onPressDayButton} days={this.state.days}/>
        <Header text={I18n.t('courseTime')} borderTop={true}/>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          borderBottomWidth: 0.5,
          borderColor: '#dedede',
          backgroundColor: '#ffffff'
        }}>
          <TouchableHighlight underlayColor='#fbfbfb' onPress={this.onPressStartTime}
                              style={{flex: 1, justifyContent: 'center', paddingLeft: 5,}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#999999', fontWeight: '100'}}>{I18n.t('startTime')}</Text>
              <Text style={{fontSize: 20}}>{this.getDateToString(this.state.startDate)}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#fbfbfb' onPress={this.onPressEndTime}
                              style={{flex: 1, justifyContent: 'center', paddingRight: 5,}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#999999', fontWeight: '100'}}>{I18n.t('endTime')}</Text>
              <Text style={{fontSize: 20}}>{this.getDateToString(this.state.endDate)}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableHighlight onPress={this.onPressDone} style={{height: 55}}>
          <View style={{height: 55, backgroundColor: '#8551e4', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#ffffff', fontSize: 16}}>{I18n.t('add')}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );


    if (this.state.view === 'modifyStartTime') {
      view =
        (<TimePicker
          date={this.state.startDate}
          title={I18n.t('startTime')}
          onPressConfirm={this.onPressModifyConfirm}
          onPressCancel={this.onPressModifyCancle}
        />);
    }
    if (this.state.view === 'modifyEndTime') {
      view =
        (<TimePicker
          date={this.state.endDate}
          title={I18n.t('endTime')}
          onPressConfirm={this.onPressModifyConfirm}
          onPressCancel={this.onPressModifyCancle}
        />);
    }

    return (
      <View style={{height: 300, flexDirection: 'column'}}>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dayBtnGroup: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height: 60,
    alignItems: 'center',
  },
  dayTouchArea: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  dayBtn: {
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 25,
  },
  dayBtnActive: {
    borderColor: '#8551e4',
    backgroundColor: '#8551e4',
  },
  dayBtnTextActive: {
    color: '#ffffff',
  },
  dayBtnText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '100',
  },
  dayBtnSplitter: {
    flex: 0.15,
  },
});
