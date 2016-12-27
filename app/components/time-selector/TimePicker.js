
import React, { Component } from 'react';
import {
  Text,
  View,
  DatePickerIOS,
  TouchableHighlight,
} from 'react-native';
import Header from './Header';

export default class TimePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // year, month, day, hours, minutes, seconds, milliseconds
      date: this.props.date || new Date(2016, 1, 1, 8, 0, 0, 0),
      minimumDate: new Date(2016, 1, 1, 7, 0, 0, 0),
      maximumDate: new Date(2016, 1, 1, 20, 0, 0, 0),
      timeZoneOffsetInHours: (-1 * (new Date()).getTimezoneOffset()) / 60,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
  }

  onDateChange(date) {
    this.setState({ date });
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

        />
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight onPress={this.onPressConfirm} style={{flex: 1}}>
            <View
              style={{height: 55, backgroundColor: '#333333', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#ffffff', fontSize: 16}}>확인</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.props.onPressCancel} style={{flex: 1}}>
            <View
              style={{height: 55, backgroundColor: '#666666', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#ffffff', fontSize: 16}}>취소</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}