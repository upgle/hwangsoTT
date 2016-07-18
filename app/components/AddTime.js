import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  DatePickerIOS,
} from 'react-native';

class Header extends Component {
  render() {
    return (
      <View style={[styles.header, { borderTopWidth: (this.props.borderTop == true) ? 1 : 0 }]}>
        <Text style={styles.headerText}>{this.props.text}</Text>
      </View>
    );
  }
}

class DaySelector extends Component {

  onPressButton(key) {
    this.props.onPressButton(key);
  }

  isActive(day) {
    return this.props.days.includes(day);
  }

  render() {
    return (
      <View style={styles.dayBtnGroup}>
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'MON')}>
          <View style={[styles.dayBtn, this.isActive('MON') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('MON') ? styles.dayBtnTextActive : {}]}>MON</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter}></View>
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'TUE')}>
          <View style={[styles.dayBtn, this.isActive('TUE') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('TUE') ? styles.dayBtnTextActive : {}]}>TUE</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter}></View>
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'WED')}>
          <View style={[styles.dayBtn, this.isActive('WED') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('WED') ? styles.dayBtnTextActive : {}]}>WED</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter}></View>
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'THU')}>
          <View style={[styles.dayBtn, this.isActive('THU') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('THU') ? styles.dayBtnTextActive : {}]}>THU</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter}></View>
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'FRI')}>
          <View style={[styles.dayBtn, this.isActive('FRI') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('FRI') ? styles.dayBtnTextActive : {}]}>FRI</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class TimePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // year, month, day, hours, minutes, seconds, milliseconds
      date: this.props.date || new Date(2016, 1, 1, 8, 0, 0, 0),
      minimumDate: new Date(2016, 1, 1, 7, 0, 0, 0),
      maximumDate: new Date(2016, 1, 1, 20, 0, 0, 0),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
  }

  onDateChange(date) {
    this.setState({ date: date });
  }

  onPressConfirm() {
    this.props.onPressConfirm(this.state.date);
  }

  render() {
    return (
      <View>
        <Header text={this.props.title}/>
        <DatePickerIOS
          minuteInterval={10}
          mode="time"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}
          date={this.state.date}
          maximumDate={this.state.maximumDate}
          minimumDate={this.state.minimumDate}
          style={{flex: 1}}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight onPress={this.onPressConfirm} style={{flex: 1}}>
            <View
              style={{flex: 1, height: 55, backgroundColor: '#333333', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#ffffff', fontSize: 16}}>확인</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.props.onPressCancel} style={{flex: 1}}>
            <View
              style={{flex: 1, height: 55, backgroundColor: '#666666', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#ffffff', fontSize: 16}}>취소</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}


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
        <Header text="강의 요일"/>
        <DaySelector onPressButton={this.onPressDayButton} days={this.state.days}/>
        <Header text="강의 시간" borderTop={true}/>
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
              <Text style={{color: '#999999', fontWeight: '100'}}>시작 시각</Text>
              <Text style={{fontSize: 20}}>{this.getDateToString(this.state.startDate)}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#fbfbfb' onPress={this.onPressEndTime}
                              style={{flex: 1, justifyContent: 'center', paddingRight: 5,}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#999999', fontWeight: '100'}}>종료 시각</Text>
              <Text style={{fontSize: 20}}>{this.getDateToString(this.state.endDate)}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableHighlight onPress={this.onPressDone} style={{height: 55}}>
          <View style={{height: 55, backgroundColor: '#8551e4', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#ffffff', fontSize: 16}}>등록</Text>
          </View>
        </TouchableHighlight>
      </View>
    );


    if (this.state.view == 'modifyStartTime') {
      view =
        <TimePicker
          date={this.state.startDate}
          title={"강의 시작 시각"}
          onPressConfirm={this.onPressModifyConfirm}
          onPressCancel={this.onPressModifyCancle}
        />;
    }
    if (this.state.view == 'modifyEndTime') {
      view =
        <TimePicker
          date={this.state.endDate}
          title={"강의 종료 시각"}
          onPressConfirm={this.onPressModifyConfirm}
          onPressCancel={this.onPressModifyCancle}
        />;
    }

    return (
      <View style={{height: 300, flexDirection: 'column'}}>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#dedede',
    paddingLeft: 10,
  },
  headerText: {
    color: '#666666',
    fontSize: 12,
  },
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
