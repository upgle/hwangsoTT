import React, { Component } from 'react';
import thunkMiddleware from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { Scene, Router, Actions } from 'react-native-router-flux';

import timetableApp from '../reducers/timetableApp';
import StoredTimeTable from './StoredTimeTable';
import KunnectContainer from './KunnectContainer';
import AddCourseContainer from './AddCourseContainer';
import { fetchAppData } from '../actions/appActions';
import { loggerMiddleware } from '../middlewares';

/**
 * Config Google Analytics
 */
GoogleAnalytics.setTrackerId('UA-80732706-1');

const RouterWithRedux = connect()(Router);
const enhancer = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  devTools()
);
let store = createStore(timetableApp, enhancer);
store.dispatch(fetchAppData());

// define this based on the styles/dimensions you use
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
  }
  return style;
};

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux getSceneStyle={getSceneStyle}>
          <Scene key="root" hideNavBar>
            <Scene key="home" component={StoredTimeTable} initial={true}/>
          </Scene>
          <Scene key="kunnect" animation="fade">
            <Scene key="kunnect1" component={KunnectContainer} title="쿠넥트 로그인" hideNavBar/>
          </Scene>
          <Scene key="addCourse" animation="fade">
            <Scene
              key="addCourse1"
              animation="fade"
              hideNavBar={false}
              component={AddCourseContainer}
              title="강의 추가"
              leftTitle="취소"
              onLeft={() => Actions.pop()}
              navigationBarStyle={{ backgroundColor: '#303c4c' }}
              titleStyle={{ color: '#fff' }}
              leftButtonTextStyle={{ color: '#ffffff' }}
              rightButtonTextStyle={{ color: '#ffffff' }}
            />
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}
