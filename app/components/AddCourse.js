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
    DatePickerIOS,
    ListView
} from 'react-native';
var Modal   = require('react-native-modalbox');
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddTime from './AddTime';

const dayKR = {
    'MON' : '월요일',
    'TUE' : '화요일',
    'WED' : '수요일',
    'THR' : '목요일',
    'FRI' : '금요일'
};

export default class AddCourse extends Component {

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.times = [];
        this.state = {
            /**
             * day : "WED"
             * start : "13:30"
             * end : "15:00"
             */
            times : this.ds.cloneWithRows(this.times)
        };

        this._onPressDeleteRow = this._onPressDeleteRow.bind(this);
        this._onPressAddTime = this._onPressAddTime.bind(this);
        this._deleteRow = this._deleteRow.bind(this);
        this._addTimes = this._addTimes.bind(this);
    }

    componentWillMount() {
        StatusBar.setHidden(false, 'none');
    }

    _onPressAddTime() {
        this.refs.modal.open();
    }

    _onPressDeleteRow(rowID) {
        this._deleteRow(rowID);
    }

    _deleteRow(rowID) {
        this.times.splice(rowID, 1);
        this.setState({
            times: this.ds.cloneWithRows(this.times),
        });
    }

    _addTimes(data) {
        data.days.forEach((day)=>{
            this.times.push({
                day : day,
                start : data.start,
                end : data.end
            });
        });
        this.setState({
            times: this.ds.cloneWithRows(this.times),
        });
    }

    render() {

        return (
            <View style={{backgroundColor: '#f4f4f4', flex:1, marginTop: 64}}>
                <View style={{ borderColor: '#f0f0f0', borderBottomWidth: 1, marginTop: 10}}>
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

                <ListView
                    style={styles.listView}
                    enableEmptySections={true}
                    dataSource={this.state.times}
                    renderRow={(rowData, sectionID, rowID) =>
                        <View style={styles.list}>
                            <View style={{width: 75}}>
                                <Text style={{color:'#333333'}}>{dayKR[rowData.day]}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection:'row'}}>
                                <Text style={{color:'#333333'}}>{rowData.start} ~ {rowData.end}</Text>
                            </View>
                            <TouchableHighlight style={{width:46}} onPress={()=>{this._onPressDeleteRow(rowID)}}>
                            <View style={{width: 46, height: 44, backgroundColor: '#ff3b30', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{color: '#ffffff'}}>삭제</Text>
                            </View>
                            </TouchableHighlight>
                        </View>}
                />
                <Modal ref="modal" position="bottom" style={styles.modal} swipeToClose={false} isOpen={false} backdropOpacity={0.6} >
                    <AddTime onPressDone={this._addTimes} />
                </Modal>
            </View>
        );
    }
}


var styles = StyleSheet.create({

    modal: {
        height: 300,
    },

    listView: {
        marginTop: 10
    },

    list : {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        paddingLeft: 20,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#f0f0f0',
        borderBottomWidth: 1
    }

});
