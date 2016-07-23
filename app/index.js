import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { registerScreens } from './containers';
import { changeState } from './actions/appActions';
import { AsyncStorage } from 'react-native';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
registerScreens(store, Provider);

/**
 * React Class 가 아닌 일반 클래스
 * @desc https://github.com/wix/react-native-navigation
 */
export default class App {

  constructor() {
    // google tracker
    GoogleAnalytics.setTrackerId('UA-80732706-1');
    GoogleAnalytics.setAppName('황소시간표');

    // since react-redux only works on components, we need to subscribe this class manually
    AsyncStorage.getItem('app_state')
      .then(data => {
        const state = JSON.parse(data) || {};

        /**
         * Version 1.0.2 -> 1.1.0
         */
        if (state.alarm && typeof state.alarm === 'boolean') state.app.alarm = state.alarm;
        if (state.courses && typeof state.courses === 'object') state.app.courses = state.courses;
        if (Array.isArray(state.times)) state.app.times = state.times;
        if (state.theme && typeof state.courses === 'object') state.app.theme = state.theme;

        store.dispatch(changeState(state.app));
        this.startApp();
      });
    // store.subscribe(this.onStoreUpdate.bind(this));
  }

  /**
   * Redux Subscribe는 사용하지 않음. 필요시 주석 제거
   */
  onStoreUpdate() {
    // this.startApp();
  }

  startApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'StoredTimeTable',
        title: '시간표',
        navigatorStyle: {
          navBarHidden: true,
        },
      },
    });
  }
}
