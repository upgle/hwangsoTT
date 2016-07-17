import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tableHead: {
    flexDirection: 'row',
    borderBottomColor: '#d0d0d0',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableHeadText: {
    color: '#999999',
    fontSize: 11,
    fontWeight: '300',
    textAlign: 'center',
  },
  tableTimeColumn: {
    backgroundColor: '#f5f5f5',
    width: 25,
  },
});

export default class TimeTableHead extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <View style={[styles.tableHead, { height: this.props.tableHeadHeight }]}>
        <View style={[styles.tableTimeColumn, { height: this.props.tableHeadHeight - 1 }]}></View>
        <Text style={[styles.tableHeadText, { flex:3 }]}>MON</Text>
        <Text style={[styles.tableHeadText, { flex:3 }]}>TUE</Text>
        <Text style={[styles.tableHeadText, { flex:3 }]}>WED</Text>
        <Text style={[styles.tableHeadText, { flex:3 }]}>THU</Text>
        <Text style={[styles.tableHeadText, { flex:3 }]}>FRI</Text>
      </View>
    );
  }
}
