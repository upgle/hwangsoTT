
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import diff from 'deep-diff';
import Icon from 'react-native-vector-icons/MaterialIcons';
var screen = Dimensions.get('window');

const tableHeadHeight = 32;
const tabeRowHeight = 44;
const daysWidth = screen.width - 25;
const oneDayWidth = daysWidth / 5;


class Cell extends Component {

  render() {
    return (
        <TouchableHighlight onPress={this.props.onClickCourse} style={{position: 'absolute', left: this.props.left, top: this.props.top}}>
          <View condition={false} style={[styles.course, {backgroundColor: this.props.backgroundColor, height: this.props.height}]}>
            <Text style={{fontSize: 12, color:this.props.textColor, textAlign: 'center'}}>
              {this.props.subject}
            </Text>
            <Text style={{fontSize: 11, color:this.props.textColor, textAlign: 'center', marginTop: 2}}>
              {this.props.classroom}
            </Text>
          </View>
        </TouchableHighlight>
    );
  }
}

class TimeTableCells extends Component {

  _onClickCourse() {
    //todo implement
  }

  _getCourseHeight(time) {

    if(!time.start || !time.end) return 0;

    var minute, hour,
        start = time.start.split(':'),
        end = time.end.split(':'),
        s_hour = Number(start[0]),
        s_minute = Number(start[1]),
        e_hour = Number(end[0]),
        e_minute = Number(end[1]);

    if( s_minute > e_minute ) {
      e_minute = e_minute + 60;
      e_hour--;
    }

    minute = e_minute - s_minute;
    hour = e_hour - s_hour;
    return (hour + (minute/60))*tabeRowHeight;
  }

  _getLeftPosition(time) {

    switch(time.day) {
      case 'MON' :
        return 25;
        break;
      case 'TUE' :
        return 25 + oneDayWidth;
        break;
      case 'WED' :
        return 25 + oneDayWidth*2;
        break;
      case 'THU' :
        return 25 + oneDayWidth*3;
        break;
      case 'FRI' :
        return 25 + oneDayWidth*4;
        break;
      case 'SAT' :
        return 25 + oneDayWidth*5;
        break;
    }
  }

  _getTopPosition(time) {
    var time = time.start.split(':');
    var hour = time[0],
        minute = time[1];
    return (hour - 8)*tabeRowHeight + (minute/60)*tabeRowHeight;
  }

  render() {

    const { courses, times, colors } = this.props;

    var autoincrement = 0;
    var colorMap = {};

    return (
      <View style={{position: 'absolute', left:0, top:0}}>
        {[...times].map((time, i)=> {
          var index;
          if(colorMap[time.course_id]) {
            index = colorMap[time.course_id];
          }
          else {
            index = colorMap[time.course_id] = autoincrement++
          }
          return (
              <Cell
                  classroom={courses[time.course_id].classroom}
                  subject={courses[time.course_id].subject}
                  left={this._getLeftPosition(time)}
                  top={this._getTopPosition(time)}
                  height={this._getCourseHeight(time)}
                  textColor={colors[index][1]}
                  backgroundColor={colors[index][0]}
                  key={i} />
          );
        })}
      </View>
    );
  }

}

class TimeTableHead extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <View style={styles.tableHead}>
        <View style={[styles.tableTimeColumn, {height: tableHeadHeight-1}]}></View>
        <Text style={[styles.tableHeadText, {flex:3}]}>MON</Text>
        <Text style={[styles.tableHeadText, {flex:3}]}>TUE</Text>
        <Text style={[styles.tableHeadText, {flex:3}]}>WED</Text>
        <Text style={[styles.tableHeadText, {flex:3}]}>THU</Text>
        <Text style={[styles.tableHeadText, {flex:3}]}>FRI</Text>
      </View>
    );
  }
}

class TimeTableLine extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <View>
      {[...Array(12)].map((x, i) =>
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableTimeColumn}>
              <Text style={styles.tableTimeText}>{i+8}</Text>
            </View>
            <View style={styles.tableColumn}></View>
            <View style={styles.tableColumn}></View>
            <View style={styles.tableColumn}></View>
            <View style={styles.tableColumn}></View>
            <View style={[styles.tableColumn, {borderRightWidth: 0}]}></View>
          </View>
      )}
      </View>
    );
  }
}

class TimeTableHands extends Component {

  shouldComponentUpdate() {
    return false;
  }

  _getHandsLeftPosition() {
    var date = new Date();
    var day = date.getDay();
    return 25 + oneDayWidth*(day-1);
  }

  _getHandsTopPosition() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return (hour - 8)*tabeRowHeight + (minute/60)*tabeRowHeight;
  }

  render() {

    var date = new Date();
    if(date.getHours() < 8 || date.getHours() > 19) {
      return null;
    }
    return (
        <View style={
            [styles.hands, {
              left: this._getHandsLeftPosition(),
              top : this._getHandsTopPosition()
            }]}>
        </View>
    );
  }
}

export default class TimeTable extends Component {

    constructor(props) {
      super(props);

      this.state = {
        tableHeight : props.height - tableHeadHeight
      }
    }

    shouldComponentUpdate(nextProps) {
      if(diff(this.props.colors, nextProps.colors)) {
        return true;
      }
      if(diff(this.props.courses, nextProps.courses)) {
        return true;
      }
      if(diff(this.props.times, nextProps.times)) {
        return true;
      }
      return false;
    }

    render() {

      const tableHeight = this.state.tableHeight;

      var timeHands;
      if(this.props.hands == true) {
        timeHands = (<TimeTableHands />);
      }

      return (
        <View style={styles.container}>
          <TimeTableHead />
          <ScrollView automaticallyAdjustContentInsets={false} style={{height: tableHeight}}>
            <TimeTableLine />
            <TimeTableCells {...this.props} />
            {timeHands}
          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  hands: {
    position: 'absolute',
    opacity: 0.35,
    width: oneDayWidth,
    height:2,
    backgroundColor: 'red',
  },
  course : {
    position: 'absolute',
    width: oneDayWidth,
    left:0,
    top: 0,
    backgroundColor:'#ff4e48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHead : {
    flexDirection: 'row',
    borderBottomColor: '#d0d0d0',
    borderBottomWidth: 1,
    height: tableHeadHeight,
    alignItems: 'center'
  },
  tableHeadText: {
    color:'#999999',
    fontSize: 11,
    fontWeight: '300',
    textAlign: 'center'
  },
  tableRow : {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  tableColumn : {
    flex: 3,
    height: 44,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  tableTimeColumn: {
    backgroundColor: '#f5f5f5',
    width: 25,
    paddingTop: 3,
    paddingRight: 3,
  },
  tableTimeText : {
    color: '#999999',
    fontSize: 11,
    fontWeight: '300',
    textAlign: 'right'
  }
});
