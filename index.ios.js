/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  NavigatorIOS
} from 'react-native';

import Main from './app/Main';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navigationBarHidden: true,
    };
  }

  render() {
    return (
      <NavigatorIOS ref="nav"
        itemWrapperStyle={styles.navWrap}
        style={styles.nav}
        navigationBarHidden={this.state.navigationBarHidden}
        initialRoute={{
          title: "First Page",
          component: Main
        }} />
    );
  }
}



var styles = StyleSheet.create({
  navWrap: {
    flex: 1,
  },
  nav: {
    flex: 1,
  },
});


AppRegistry.registerComponent('App', () => App);
