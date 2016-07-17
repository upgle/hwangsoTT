
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
  ActionSheetIOS
} from 'react-native';
import diff from 'deep-diff';
import TimeTableHands from './TimeTableHands';
import TimeTableHead from './TimeTableHead';
import _ from 'underscore';

var screen = Dimensions.get('window');

const tableHeadHeight = 32;
const tableRowHeight = 44;
const daysWidth = screen.width - 25;
const oneDayWidth = daysWidth / 5;


class Cell extends Component {

  render() {
    return (
        <TouchableHighlight onPress={this.props.onPress} style={{position: 'absolute', left: this.props.left, top: this.props.top}}>
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

  static propTypes = {
    onPressCell: React.PropTypes.func
  };

  static defaultProps = {
    onPressCell: () => {}
  };

  constructor(props) {
    super(props);
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
    return (hour + (minute/60))*tableRowHeight;
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
    var start = time.start.split(':');
    var hour = start[0],
        minute = start[1];
    return (hour - 8)*tableRowHeight + (minute/60)*tableRowHeight;
  }

  render() {

    const { courses, times, colors } = this.props;

    var autoincrement = 0;
    var colorMap = {};
    var colorLength = colors.length;

    return (
      <View style={{position: 'absolute', left:0, top:0}}>
        {[...times].map((time, i)=> {
          var index;
          if(_.isNumber(colorMap[time.course_id])) {
            index = colorMap[time.course_id];
          }
          else {
            colorMap[time.course_id] = autoincrement++;
            index = colorMap[time.course_id];
          }
          return (
              <Cell
                  onPress={this.props.onPressCell.bind(this, time.course_id)}
                  classroom={courses[time.course_id].classroom}
                  subject={courses[time.course_id].subject}
                  left={this._getLeftPosition(time)}
                  top={this._getTopPosition(time)}
                  height={this._getCourseHeight(time)}
                  textColor={colors[index % colorLength][1]}
                  backgroundColor={colors[index % colorLength][0]}
                  key={i} />
          );
        })}
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
        timeHands = (<TimeTableHands oneDayWidth={oneDayWidth} tableRowHeight={tableRowHeight} />);
      }

      return (
        <View style={styles.container}>
          <TimeTableHead tableHeadHeight={tableHeadHeight} />
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
