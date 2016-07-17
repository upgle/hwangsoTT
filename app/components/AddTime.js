import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    StatusBar,
    TextInput,
    Picker,
    DatePickerIOS,
} from 'react-native';


class Header extends Component {
    render() {
        return (
            <View style={{ justifyContent: 'center', height: 30, borderTopWidth: (this.props.borderTop == true) ? 1 : 0, borderBottomWidth: 1, borderColor: '#dedede', paddingLeft:10}}>
                <Text style={{color: '#666666', fontSize: 12}}>{this.props.text}</Text>
            </View>
        );
    }
}

class DaySelector extends Component {

    constructor(props) {
        super(props);
    }

    _onPressButton(key) {
        this.props.onPressButton(key);
    }

    _isActive(day) {
        return this.props.days.includes(day);
    }

    render() {
        return (
            <View style={styles.dayBtnGroup}>
                <TouchableOpacity style={{ flex: 1 }} onPress={this._onPressButton.bind(this, 'MON')}>
                    <View style={[styles.dayBtn, this._isActive('MON') ? styles.dayBtnActive : {}]}>
                        <Text style={[styles.dayBtnText, this._isActive('MON') ? styles.dayBtnTextActive : {} ]}>MON</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.dayBtnSplitter}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this._onPressButton.bind(this, 'TUE')}>
                    <View style={[styles.dayBtn, this._isActive('TUE') ? styles.dayBtnActive : {}]}>
                        <Text style={[styles.dayBtnText, this._isActive('TUE') ? styles.dayBtnTextActive : {} ]}>TUE</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.dayBtnSplitter}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this._onPressButton.bind(this, 'WED')}>
                    <View style={[styles.dayBtn, this._isActive('WED') ? styles.dayBtnActive : {}]}>
                        <Text style={[styles.dayBtnText, this._isActive('WED') ? styles.dayBtnTextActive : {} ]}>WED</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.dayBtnSplitter}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this._onPressButton.bind(this, 'THU')}>
                    <View style={[styles.dayBtn, this._isActive('THU') ? styles.dayBtnActive : {}]}>
                        <Text style={[styles.dayBtnText, this._isActive('THU') ? styles.dayBtnTextActive : {} ]}>THU</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.dayBtnSplitter}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this._onPressButton.bind(this, 'FRI')}>
                    <View style={[styles.dayBtn, this._isActive('FRI') ? styles.dayBtnActive : {}]}>
                        <Text style={[styles.dayBtnText, this._isActive('FRI') ? styles.dayBtnTextActive : {} ]}>FRI</Text>
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
            minimumDate : new Date(2016, 1, 1, 7, 0, 0, 0),
            maximumDate : new Date(2016, 1, 1, 20, 0, 0, 0),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
        };
        this._onDateChange = this._onDateChange.bind(this);
        this._onPressConfirm = this._onPressConfirm.bind(this);
    }

    _onDateChange(date) {
        this.setState({date: date});
    }

    _onPressConfirm() {
        this.props.onPressConfirm(this.state.date);
    }

    render() {
        return(
            <View>
                <Header text={this.props.title} />
                <DatePickerIOS
                    minuteInterval={10}
                    mode="time"
                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                    onDateChange={this._onDateChange}
                    date={this.state.date}
                    maximumDate={this.state.maximumDate}
                    minimumDate={this.state.minimumDate}
                    style={{flex: 1}}
                />
                <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight onPress={this._onPressConfirm} style={{flex : 1}}>
                        <View style={{flex: 1, height: 55, backgroundColor: '#333333', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#ffffff', fontSize: 16 }}>확인</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.props.onPressCancel} style={{flex : 1}}>
                        <View style={{flex: 1, height: 55, backgroundColor: '#666666', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#ffffff', fontSize: 16 }}>취소</Text>
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

            days : [],

            // year, month, day, hours, minutes, seconds, milliseconds
            startDate : new Date(2016, 1, 1, 8, 0, 0, 0),
            endDate : new Date(2016, 1, 1, 10, 0, 0, 0),

            view : 'default',
        };
        this._onPressDone = this._onPressDone.bind(this);
        this._onPressStartTime = this._onPressStartTime.bind(this);
        this._onPressEndTime = this._onPressEndTime.bind(this);
        this._onPressModifyCancle = this._onPressModifyCancle.bind(this);
        this._onPressModifyConfirm = this._onPressModifyConfirm.bind(this);
        this._onPressDayButton = this._onPressDayButton.bind(this);
    }

    _onPressStartTime() {
        this.setState({
            view: 'modifyStartTime',
        })
    }

    _onPressDone() {

        let start = this._zeroPad(this.state.startDate.getHours()) + ':' + this._zeroPad(this.state.startDate.getMinutes()),
            end = this._zeroPad(this.state.endDate.getHours()) + ':' + this._zeroPad(this.state.endDate.getMinutes());

        if(this.state.days.length === 0) {
            Alert.alert(
                '안내',
                '요일을 1개 이상 선택해주세요',
                [
                    {text: '확인'},
                ]
            );
            return;
        }
        if(this.state.startDate.getTime() >= this.state.endDate.getTime()) {
            Alert.alert(
                '안내',
                '종료 시각은 시작 시각보다 뒤에 있어야 합니다',
                [
                    {text: '확인'},
                ]
            );
            return;
        }

        this.props.onPressDone({
            days : this.state.days,
            start : start,
            end : end
        });
    }

    _onPressEndTime() {
        this.setState({
            view: 'modifyEndTime',
        })
    }

    _onPressModifyCancle() {
        this.setState({
            view: 'default'
        })
    }

    _onPressModifyConfirm(date) {
        switch(this.state.view) {
            case 'modifyStartTime' :
                this.setState({
                    view: 'default',
                    startDate: date,
                    endDate : (date.getTime() > this.state.endDate.getTime()) ? date : this.state.endDate
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

    _onPressDayButton(day) {
        var index = this.state.days.indexOf(day);
        if( index < 0 ) {
            let days = this.state.days.slice();
            days.push(day);
            this.setState({days : days});
        }
        else {
            let days = this.state.days.slice();
            days.splice(index, 1);
            this.setState({days : days});
        }


    }

    _zeroPad(nr, base = 10) {
        var  len = (String(base).length - String(nr).length)+1;
        return len > 0? new Array(len).join('0')+nr : nr;
    }

    _getDateToString(date) {
        var str = '오후 ';

        if(date.getHours() < 12) {
            str = '오전 ';
        }
        var hours = date.getHours();
        if(hours !== 12) {
            hours = date.getHours() % 12;
        }
        str += this._zeroPad(hours);
        str += ':';
        str += this._zeroPad(date.getMinutes());
        return str;
    }

    render() {

        let view = (
            <View style={{flex: 1}}>
                <Header text="강의 요일" />
                <DaySelector onPressButton={this._onPressDayButton} days={this.state.days} />
                <Header text="강의 시간" borderTop={true} />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingLeft: 10, borderBottomWidth: 0.5, borderColor: '#dedede', backgroundColor:'#ffffff'}}>
                    <TouchableHighlight onPress={this._onPressStartTime} style={{flex : 1, justifyContent:'center'}}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color:'#999999', fontWeight: '100'}}>시작 시각</Text>
                            <Text style={{fontSize: 20}}>{this._getDateToString(this.state.startDate)}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._onPressEndTime} style={{flex : 1, justifyContent:'center'}}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color:'#999999', fontWeight: '100'}}>종료 시각</Text>
                            <Text style={{fontSize: 20}}>{this._getDateToString(this.state.endDate)}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight onPress={this._onPressDone} style={{height: 55}}>
                    <View style={{height: 55, backgroundColor: '#8551e4', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#ffffff', fontSize: 16 }}>등록</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );


        if(this.state.view == 'modifyStartTime') {
            view =
                <TimePicker
                    date={this.state.startDate}
                    title={"강의 시작 시각"}
                    onPressConfirm={this._onPressModifyConfirm}
                    onPressCancel={this._onPressModifyCancle}
                />;
        }
        if(this.state.view == 'modifyEndTime') {
            view =
                <TimePicker
                    date={this.state.endDate}
                    title={"강의 종료 시각"}
                    onPressConfirm={this._onPressModifyConfirm}
                    onPressCancel={this._onPressModifyCancle}
                />;
        }

        return (
            <View style={{height: 300, flexDirection:'column'}}>
                {view}
            </View>
        );
    }
}

var styles = StyleSheet.create({

    dayBtnGroup : {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        height: 60,
        alignItems: 'center'
    },

    dayBtn : {
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 25,
    },

    dayBtnActive: {
        borderColor: '#8551e4',
        backgroundColor: '#8551e4'
    },

    dayBtnTextActive : {
        color: '#ffffff'
    },

    dayBtnText : {
        fontSize: 12,
        color: '#999999',
        fontWeight: '100'
    },

    dayBtnSplitter : {
        flex: 0.15
    }

});
