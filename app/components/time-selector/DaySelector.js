import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

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

export default class DaySelector extends Component {

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
        <View style={styles.dayBtnSplitter} />
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'TUE')}>
          <View style={[styles.dayBtn, this.isActive('TUE') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('TUE') ? styles.dayBtnTextActive : {}]}>TUE</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter} />
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'WED')}>
          <View style={[styles.dayBtn, this.isActive('WED') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('WED') ? styles.dayBtnTextActive : {}]}>WED</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter} />
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'THU')}>
          <View style={[styles.dayBtn, this.isActive('THU') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('THU') ? styles.dayBtnTextActive : {}]}>THU</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.dayBtnSplitter} />
        <TouchableOpacity style={styles.dayTouchArea} onPress={this.onPressButton.bind(this, 'FRI')}>
          <View style={[styles.dayBtn, this.isActive('FRI') ? styles.dayBtnActive : {}]}>
            <Text style={[styles.dayBtnText, this.isActive('FRI') ? styles.dayBtnTextActive : {}]}>FRI</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
