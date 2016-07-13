
import React, { Component } from 'react';

import timetableApp from '../reducers/timetableApp';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import StoredTimeTable from './StoredTimeTable';
import { NavigatorIOS, StyleSheet } from 'react-native';
import { fetchAppData } from '../actions/appActions';
import thunkMiddleware from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

GoogleAnalytics.setTrackerId('UA-80732706-1');
GoogleAnalytics.trackScreenView('Home');

const enhancer = compose(
  applyMiddleware(thunkMiddleware),
  devTools()
);
let store = createStore(timetableApp, enhancer);
store.dispatch(fetchAppData());

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
