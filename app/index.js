import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import thunk from 'redux-thunk';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { AsyncStorage } from 'react-native';
// import devTools from 'remote-redux-devtools';

import { registerScreens } from './containers';
import { changeState } from './actions/appActions';
import * as reducers from './reducers';
import { alarmMiddleware } from './middlewares';

// import * as firebase from 'firebase';
// const firebaseConfig = {
//   apiKey: "AIzaSyC9owkUDuui3rpME_xL0Ec_dXh3tty7K0o",
//   authDomain: "tau-app.firebaseapp.com",
//   databaseURL: "https://tau-app.firebaseio.com",
//   storageBucket: "tau-app.appspot.com",
//   messagingSenderId: "549737176638"
// };
//
// const firebaseApp = firebase.initializeApp(firebaseConfig);
// var database = firebase.database();

/**
 * React-Redux Booting
 */
const enhancer = compose(
  applyMiddleware(thunk, alarmMiddleware),
  // devTools()
);
const reducer = combineReducers(reducers);
const store = createStore(reducer, enhancer);

/**
 * Google Analytics Setting
 */
GoogleAnalytics.setTrackerId('UA-80732706-1');
GoogleAnalytics.setAppName('황소시간표');

AsyncStorage.getItem('app_state')
  .then(data => {
    const state = JSON.parse(data) || {};

    /**
     * Version 1.0.2 -> 1.1.0
     */
    if (!state.app && state.courses && (Array.isArray(state.times))) {
      state.app = {
        courses: state.courses,
        times: state.times,
      };
      if (state.theme && typeof state.courses === 'object') {
        state.app.theme = state.theme;
      }
      if (state.alarm && typeof state.alarm === 'boolean') {
        state.app.alarm = state.alarm;
      }
    }
    /**
     * VErsion 1.1.2 -> 1.1.3
     */
    if (state.app && !state.app.themeId) {
      state.app.themeId = '0001';
    }
    store.dispatch(changeState(state.app));
  });

/**
 * react-native-navigation
 * @desc navigation 에서 사용하는 screen 등록
 */
registerScreens(store, Provider);

Navigation.startSingleScreenApp({
  screen: {
    screen: 'StoredTimeTable',
    title: '시간표',
    navigatorStyle: {
      navBarHidden: true,
    },
  },
});
store.subscribe(() => {
  AsyncStorage.setItem('app_state', JSON.stringify(store.getState()));
});
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     store.dispatch(signIn(user));
//   } else {
//     // User is signed out.
//     // ...
//   }
// });
