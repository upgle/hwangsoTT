import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import TimerMixin from 'react-timer-mixin';

const propTypes = {
  oneDayWidth: PropTypes.number.isRequired,
  tableRowHeight: PropTypes.number.isRequired,
};

const defaultProps = {
  oneDayWidth: 100,
  tableRowHeight: 100,
};

const styles = StyleSheet.create({
  hands: {
    position: 'absolute',
    opacity: 0.35,
    height: 2,
    backgroundColor: 'red',
  },
});

export default class TimeTableHands extends Component {

  componentDidMount() {
    this.setTimer();
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  /**
   * Force update 로 처리됩니다.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.unsetTimer();
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }

  getHandsLeftPosition() {
    const day = (new Date()).getDay();
    return 25 + this.props.oneDayWidth * (day - 1);
  }

  getHandsTopPosition() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return (hour - 8) * this.props.tableRowHeight + (minute / 60) * this.props.tableRowHeight;
  }

  setTimer() {
    this.timer = TimerMixin.setInterval(
      () => {
        this.forceUpdate();
      },
      60000 // 1minute
    );
  }

  unsetTimer() {
    TimerMixin.clearInterval(this.timer);
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

  render() {
    const date = new Date();
    if (date.getHours() < 8 || date.getHours() > 19) {
      return null;
    }
    return (
      <View
        style={
        [styles.hands, {
          width: this.props.oneDayWidth,
          left: this.getHandsLeftPosition(),
          top: this.getHandsTopPosition(),
        }]}
      />
    );
  }
}
TimeTableHands.defaultProps = defaultProps;
TimeTableHands.propTypes = propTypes;


