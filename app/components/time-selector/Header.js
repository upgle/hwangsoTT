import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#dedede',
    paddingLeft: 10,
  },
  headerText: {
    color: '#666666',
    fontSize: 12,
  },
});

export default function (props) {
  return (
    <View style={[styles.header, { borderTopWidth: (props.borderTop === true) ? 1 : 0 }]}>
      <Text style={styles.headerText}>{props.text}</Text>
    </View>
  );
}
