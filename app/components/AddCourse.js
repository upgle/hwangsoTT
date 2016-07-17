import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
  StatusBar,
  TextInput,
  ListView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AddTime from './AddTime';
import * as timetable from '../util/timetable';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
const Modal = require('./ModalBox');

const dayKR = {
  MON: '월요일',
  TUE: '화요일',
  WED: '수요일',
  THU: '목요일',
  FRI: '금요일',
};

export default class AddCourse extends Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.allTimes = this.props.allTimes.slice(0) || [];
    this.times = this.props.times.slice(0) || [];
    this.state = {
      /**
       * day : "WED"
       * start : "13:30"
       * end : "15:00"
       */
      subject: this.props.subject || '',
      professor: this.props.professor || '',
      classroom: this.props.classroom || '',
      times: this.ds.cloneWithRows(this.times),
    };

    this.onPressDeleteRow = this.onPressDeleteRow.bind(this);
    this.onPressAddTime = this.onPressAddTime.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.addTimes = this.addTimes.bind(this);
    this.closeModalAndKeyboard = this.closeModalAndKeyboard.bind(this);
  }

  componentWillMount() {
    StatusBar.setHidden(false, 'none');
  }

  closeModalAndKeyboard() {
    dismissKeyboard();
    this.refs.modal.close();
  }

  onPressAddTime() {
    dismissKeyboard();
    this.refs.modal.open();
  }

  onPressDeleteRow(rowID) {
    dismissKeyboard();
    this.deleteRow(rowID);
  }

  deleteRow(rowID) {
    this.times.splice(rowID, 1);
    this.setState({
      times: this.ds.cloneWithRows(this.times),
    });
  }

  addTimes(data) {
    let counter = 0;

    data.days.forEach((day) => {
      const time = {
        day: day,
        start: data.start,
        end: data.end,
      };

      const overlappedIndexFromAllTimes = timetable.getOverlappedTimeIndex(this.allTimes, time);
      if (overlappedIndexFromAllTimes >= 0) {
        Alert.alert(
          '안내',
          dayKR[time.day] + ' ' + time.start + '~' + time.end + ' 시간은 이미 등록된 시간과 겹칩니다.',
          [
            { text: '확인' },
          ]
        );
        return;
      }

      const overlappedIndex = timetable.getOverlappedTimeIndex(this.times, time);
      if (overlappedIndex >= 0) {
        var overTime = this.times[overlappedIndex];
        Alert.alert(
          '안내',
          dayKR[time.day] + ' ' + time.start + '~' + time.end + ' 시간은\n' +
          dayKR[overTime.day] + ' ' + overTime.start + '~' + overTime.end + ' 시간과\n겹칩니다.',
          [
            { text: '확인' },
          ]
        );
        return;
      }
      this.times.push(time);
      counter++;
    });

    if (counter > 0) {
      this.setState({
        times: this.ds.cloneWithRows(this.times),
      });
    }
  }

  render() {
    let deleteBtn;
    if (this.props.showDeleteBtn) {
      deleteBtn = (
        <TouchableHighlight onPress={this.props.onPressDelete} style={{marginTop: 10, marginBottom: 10}}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 45,
            backgroundColor: '#ffffff'
          }}>
            <Icon name='remove-circle' color='#E41106' size={20}/>
            <Text style={{color: '#E41106'}}> 이 강의를 삭제합니다</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <View style={{backgroundColor: '#f4f4f4', flex: 1}}>
        <View style={{borderColor: '#f0f0f0', borderBottomWidth: 1, marginTop: 10}}>
          <TextInput
            value={this.state.subject}
            onChangeText={(text) => this.setState({subject: text})}
            placeholder="강의 이름"
            style={{height: 45, paddingLeft: 20, backgroundColor: 'white'}}
          />
        </View>
        <View style={{borderColor: '#f0f0f0', borderBottomWidth: 1}}>
          <TextInput
            value={this.state.professor}
            onChangeText={(text) => this.setState({professor: text})}
            placeholder="교수명"
            style={{height: 45, paddingLeft: 20, backgroundColor: 'white'}}
          />
        </View>
        <View style={{borderColor: '#f0f0f0', borderBottomWidth: 1}}>
          <TextInput
            value={this.state.classroom}
            onChangeText={(text) => this.setState({classroom: text})}
            placeholder="강의실"
            style={{height: 45, paddingLeft: 20, backgroundColor: 'white'}}
          />
        </View>

        <TouchableHighlight onPress={this.onPressAddTime} style={{marginTop: 10}}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 45,
            backgroundColor: '#ffffff',
          }}>
            <Icon name='add' color='#303c4c' size={20}/>
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
                <Text style={{color: '#333333'}}>{dayKR[rowData.day]}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{color: '#333333'}}>{rowData.start} ~ {rowData.end}</Text>
              </View>
              <TouchableHighlight style={{width: 46}} onPress={()=> {
                this.onPressDeleteRow(rowID)
              }}>
                <View style={styles.listRemoveBtn}>
                  <Text style={styles.whiteText}>삭제</Text>
                </View>
              </TouchableHighlight>
            </View>}
        />
        {deleteBtn}
        <Modal ref="modal" position="bottom"
               style={styles.modal}
               swipeToClose={false}
               isOpen={false}
               backdropOpacity={0.6}
        >
          <AddTime onPressDone={this.addTimes}/>
        </Modal>
      </View>
    );
  }
}

AddCourse.propTypes = {
  showDeleteBtn: React.PropTypes.bool,
  allTimes: React.PropTypes.array,
  times: React.PropTypes.array,

  subject: React.PropTypes.string,
  professor: React.PropTypes.string,
  classroom: React.PropTypes.string,
};

AddCourse.defaultProps = {
  showDeleteBtn: false,
  allTimes: [],
  times: [],
};

const styles = StyleSheet.create({

  modal: {
    height: 300,
  },

  listView: {
    marginTop: 10
  },

  listRemoveBtn: {
    width: 46,
    height: 44,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },

  whiteText: {
    color: '#ffffff',
  },

  list: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0f0f0',
    borderBottomWidth: 1,
  },

});
