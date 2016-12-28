import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import Header from '../components/Header';
import TimeTable from '../components/TimeTable';
import { getTodayTimes } from '../reducers/app/reducer';

export default class ThemeStore extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { app } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>THEME</Text>
            <Text style={styles.headerTextStore}>STORE</Text>
          </View>
          <TouchableOpacity onPress={this.props.onPressCloseButton} style={{padding: 10, right: -10, top: -13}}>
            <Ionicon name={'ios-close'} color={'#333333'} size={50} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{
            height: 400,
            transform: [
              { scale: 0.8 },
            ],
          }}>
            <Header
              color={app.theme.header}
              courses={app.courses}
              todayTimes={getTodayTimes(app.times)}
              onClickMenu={this.openDrawer}
            />
            <TimeTable
              colors={app.theme.cells}
              courses={app.courses}
              times={app.times}
              hands={true}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
  },
  headerText: {
    fontSize: 42,
    fontWeight: '300',
  },
  headerTextStore: {
    top: -6,
    fontSize: 42,
    fontWeight: '500',
  },
  closeIcon: {
    alignSelf: 'flex-start',
  },
};