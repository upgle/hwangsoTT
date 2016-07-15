import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    StatusBar,
    TextInput,
    Picker,
    DatePickerIOS
} from 'react-native';
var Modal   = require('react-native-modalbox');
import Icon from 'react-native-vector-icons/MaterialIcons';


class AddTime extends Component {

}

export default class AddCourse extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // year, month, day, hours, minutes, seconds, milliseconds
            date: new Date(2016, 1, 1, 8, 0, 0, 0),
            minimumDate : new Date(2016, 1, 1, 7, 0, 0, 0),
            maximumDate : new Date(2016, 1, 1, 20, 0, 0, 0),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
        };
        this._onDateChange = this._onDateChange.bind(this);
        this._onPressAddTime = this._onPressAddTime.bind(this);
    }

    componentWillMount() {
        StatusBar.setHidden(false, 'none');
    }

    _onPressAddTime() {
        this.refs.modal.open();
    }

    _onDateChange(date) {
        this.setState({date: date});
    }

    render() {

        var datePicker = (
            <DatePickerIOS
                minuteInterval={10}
                mode="time"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={this._onDateChange}
                date={this.state.date}
                maximumDate={this.state.maximumDate}
                minimumDate={this.state.minimumDate}
                style={{height: 162}}
            />
        );

        return (
            <View style={{backgroundColor: '#f4f4f4', flex:1, marginTop: 64}}>
                <Text>Hello World</Text>
                <View style={{ borderColor: '#f0f0f0', borderBottomWidth: 1}}>
                    <TextInput
                        placeholder="강의 이름"
                        style={{height: 45, paddingLeft:20, backgroundColor:'white'}}
                    />
                </View>
                <View style={{ borderColor: '#f0f0f0', borderBottomWidth: 1}}>
                    <TextInput
                        placeholder="교수명"
                        style={{height: 45, paddingLeft:20, backgroundColor:'white'}}
                    />
                </View>
                <View style={{ borderColor: '#f0f0f0', borderBottomWidth: 1}}>
                    <TextInput
                        placeholder="강의실"
                        style={{height: 45, paddingLeft:20, backgroundColor:'white'}}
                    />
                </View>

                <TouchableHighlight onPress={this._onPressAddTime} style={{ marginTop: 10 }}>
                    <View style={{flexDirection : 'row', alignItems:'center', justifyContent:'center', height: 45,  backgroundColor: '#ffffff'}}>
                        <Icon name='add' color='#303c4c' size={20} />
                        <Text style={{color: '#303c4c'}}>강의 시간 추가</Text>
                    </View>
                </TouchableHighlight>

                <Modal ref="modal" position="bottom" style={styles.modal} swipeToClose={false} isOpen={true}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ justifyContent: 'center', height: 30, borderBottomWidth: 1, borderBottomColor: '#dedede', paddingLeft:10}}>
                            <Text style={{color: '#666666', fontSize: 12}}>강의 요일</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, height: 60, alignItems: 'center' }}>
                            <View style={styles.dayBtn}>
                                <Text style={styles.dayBtnText}>MON</Text>
                            </View>
                            <View style={{flex: 0.15}}></View>
                            <View style={styles.dayBtn}>
                                <Text style={styles.dayBtnText}>TUE</Text>
                            </View>
                            <View style={{flex: 0.15}}></View>
                            <View style={styles.dayBtn}>
                                <Text style={styles.dayBtnText}>WED</Text>
                            </View>
                            <View style={{flex: 0.15}}></View>
                            <View style={styles.dayBtn}>
                                <Text style={styles.dayBtnText}>THR</Text>
                            </View>
                            <View style={{flex: 0.15}}></View>
                            <View style={styles.dayBtn}>
                                <Text style={styles.dayBtnText}>FRI</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', height: 30, borderTopWidth:1, borderBottomWidth: 1, borderColor: '#dedede', paddingLeft:10}}>
                            <Text style={{color: '#666666', fontSize: 12}}>강의 시간</Text>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', height: 90, justifyContent: 'center', paddingLeft: 10, borderBottomWidth: 0.5, borderColor: '#dedede', backgroundColor:'#ffffff'}}>
                                <View style={{flex : 1, alignItems: 'center', justifyContent:'center'}}>
                                    <Text style={{color:'#999999', fontWeight: '100'}}>시작 시간</Text>
                                    <Text style={{fontSize: 18}}>오전 09:00</Text>
                                </View>
                                <View style={{flex : 1, alignItems: 'center', justifyContent:'center'}}>
                                    <Text style={{color:'#999999', fontWeight: '100'}}>종료 시간</Text>
                                    <Text style={{fontSize: 18}}>오전 09:00</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


var styles = StyleSheet.create({

    modal: {
        flexDirection:'column',
        height: 270,
    },

    dayBtn : {
        flex: 1,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 25,
    },

    dayBtnText : {
        fontSize: 12,
        color: '#999999',
        fontWeight: '100'
    }

});
