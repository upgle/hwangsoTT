
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
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TimeTable from './TimeTable';

var screen = Dimensions.get('window');

const headerHeight = 125;

class TimeTableWithHeader extends Component {

    constructor(props) {
      super(props);
      this.state = {
        courses : {}
      }
    }

    componentDidMount() {
      AsyncStorage.getItem('courses', (err, result) => {
        this.setState({courses: JSON.parse(result)});
      });
    }

    render() {

      var TextArea;


      TextArea = (
        <View style={{marginTop: 10}}>
          <Text style={styles.headerBigText}>시간표가 없습니다</Text>
          <Text style={styles.headerSmallText}>동기화를 먼저 진행해주세요.</Text>
        </View>
      );

      TextArea = (
        <View style={{marginTop: 10}}>
          <Text style={styles.headerBigText}>오늘 수업 끝</Text>
          <Text style={styles.headerSmallText}>모든 수업이 종료되었습니다.</Text>
        </View>
      );

      TextArea = (
        <View style={{marginTop: 10}}>
          <Text style={styles.headerBigText}>오늘 수업 없음</Text>
          <Text style={styles.headerSmallText}>오늘은 수업이 없습니다.</Text>
        </View>
      );

      TextArea = (
        <View>
          <Text style={styles.headerSmallText}>다음수업</Text>
          <Text style={styles.headerBigText}>전공기초프로그래밍</Text>
          <Text style={styles.headerSmallText2}>30분 남음</Text>
        </View>
      );

      return (
        <View style={{backgroundColor:'white', flexDirection:'column'}}>
          <View style={styles.header}>
            {TextArea}
            <TouchableOpacity style={styles.menuPosition} onPress={this.props.onClickMenu}>
              <View style={styles.menuView}>
                <Icon name='menu' color='#e9fffc' size={28} />
              </View>
            </TouchableOpacity>
          </View>
          <TimeTable height={screen.height - headerHeight} courses={this.state.courses} />
        </View>
      );
    }
}

module.exports = TimeTableWithHeader;

const styles = StyleSheet.create({
  menuPosition: {
    position: 'absolute', top: 27, left: 16
  },
  menuView: {
    flexDirection: 'row',
    alignItems : 'center'
  },
  menuText: {
    marginLeft: 3,
    fontSize: 15,
    color:'white',
  },
  header : {
    paddingTop : 40,
    backgroundColor: '#3ebfba',
    height: headerHeight,
  },
  headerBigText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerSmallText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '200',
    textAlign: 'center'
  },
  headerSmallText2: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  },
});
