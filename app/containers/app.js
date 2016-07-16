import React, {Component} from 'react';
import thunkMiddleware from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import {Scene, Router} from 'react-native-router-flux';

import timetableApp from '../reducers/timetableApp';
import StoredTimeTable from './StoredTimeTable';
import KunnectContainer from './KunnectContainer';
import AddCourseContainer from './AddCourseContainer';
import {fetchAppData} from '../actions/appActions';

/**
 * Config Google Analytics
 */
GoogleAnalytics.setTrackerId('UA-80732706-1');
GoogleAnalytics.trackScreenView('Home');

const RouterWithRedux = connect()(Router);
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
                <RouterWithRedux>
                    <Scene key="root">
                        <Scene key="home" component={StoredTimeTable} title="시간표" initial={true} hideNavBar={true} />
                        <Scene key="kunnect" component={KunnectContainer} title="쿠넥트 로그인" hideNavBar={true} />
                        <Scene key="addCourse" component={AddCourseContainer} title="강의 추가" backTitle="뒤로" hideNavBar={false} navigationBarStyle={{backgroundColor:'#303c4c'}} titleStyle={{color:'#fff'}} backButtonTextStyle={{color:'#fff'}} />
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}
