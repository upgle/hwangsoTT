

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import TimerMixin from 'react-timer-mixin';

export default class TimeTableHands extends Component {

    componentDidMount() {
        this.timer = TimerMixin.setInterval(
            () => {
                this.forceUpdate();
            },
            60000
        );
    }

    componentWillUnmount() {
        TimerMixin.clearInterval(this.timer);
    }

    shouldComponentUpdate() {
        return false;
    }

    _getHandsLeftPosition() {
        var date = new Date();
        var day = date.getDay();
        return 25 + this.props.oneDayWidth*(day-1);
    }

    _getHandsTopPosition() {
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        return (hour - 8)*this.props.tabelRowHeight + (minute/60)*this.props.tabelRowHeight;
    }

    render() {
        var date = new Date();
        if(date.getHours() < 8 || date.getHours() > 19) {
            return null;
        }
        return (
            <View style={
            [styles.hands, {
              width: this.props.oneDayWidth,
              left: this._getHandsLeftPosition(),
              top : this._getHandsTopPosition()
            }]}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    hands: {
        position: 'absolute',
        opacity: 0.35,
        height: 2,
        backgroundColor: 'red',
    }
});