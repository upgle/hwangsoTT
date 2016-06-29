
import React, { Component } from 'react';

import timetableApp from '../reducers/timetableApp';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import StoredTimeTable from './StoredTimeTable';
import { NavigatorIOS, StyleSheet } from 'react-native';

let store = createStore(timetableApp);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigatorIOS ref="nav"
          itemWrapperStyle={styles.navWrap}
          style={styles.nav}
          navigationBarHidden={true}
          initialRoute={{
            title: "First Page",
            component: StoredTimeTable
          }} />
      </Provider>
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
