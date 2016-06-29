
import React, { Component } from 'react';

import timetableApp from '../reducers/timetableApp';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import StoredTimeTable from './StoredTimeTable';
import { NavigatorIOS, StyleSheet } from 'react-native';
import { fetchAppData } from '../actions/appActions';
import thunkMiddleware from 'redux-thunk';

let store = createStore(timetableApp, applyMiddleware(thunkMiddleware));

store.dispatch(fetchAppData()).then(() =>
  console.log(store.getState())
);

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
