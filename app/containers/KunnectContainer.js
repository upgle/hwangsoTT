
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Alert} from 'react-native';
import LoginKunnect from '../components/LoginKunnect';
import { TimeConverter, YoilConverter } from '../util/kunnect';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

class KunnectContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };

        this._onClickLogin = this._onClickLogin.bind(this);
        this._onClickClose = this._onClickClose.bind(this);
        this._fetchTimeTable = this._fetchTimeTable.bind(this);
        this._catchError = this._catchError.bind(this);
    }

    componentDidMount() {
        GoogleAnalytics.trackScreenView('쿠넥트 로그인');
    }

    _onClickClose() {

    }

    _catchError(err) {
        this.setState({
            isLoading: false
        });
        Alert.alert('안내', err.message, [{text: 'OK'}]);
    }

    _onClickLogin(id, password) {

        GoogleAnalytics.trackEvent('시간표 불러오기', '쿠넥트 로그인 버튼 클릭', { id });

        var data = new FormData();
        data.append('id', id);
        data.append('password', password);

        this.setState({
            isLoading: true
        });

        fetch('https://www.kunnect.net/login', {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Cookie': '',
            },
            body: data
        })
            .then(response => response.json())
            .then((response) => {

                if(parseInt(response.result) !== 200) {
                    GoogleAnalytics.trackEvent('시간표 불러오기', '쿠넥트 로그인 실패');
                    throw Error('로그인에 실패했습니다.');
                }

                this._fetchTimeTable();
            })
            .catch(this._catchError);
    }


    _fetchTimeTable() {

        const {actions} = this.props;
        var courses = {};
        var times = [];

        fetch('https://www.kunnect.net/timetable/1/mycourse')
            .then(response => response.json())
            .then((response) => {

                actions.removeAllCourses();
                response.returns.forEach((data) => {
                    var time = TimeConverter(data.timeStart, data.timeEnd);

                    courses[data.sbjtId] = {
                        id : data.sbjtId,
                        subject: data.subject,
                        professor : data.prof,
                        classroom : data.building + data.classroom
                    };
                    times = [{
                        course_id : data.sbjtId,
                        day: YoilConverter(data.yoil),
                        start: time.start,
                        end: time.end,
                    }, ...times];
                });
                actions.addCourses(courses);
                actions.addTimes(times);

                this.setState({
                    isLoading: false
                });

                GoogleAnalytics.trackEvent('시간표 불러오기', '쿠넥트 시간표 불러오기 성공');
                Alert.alert(
                    '안내', '시간표 불러오기 성공',
                    [
                        {text: 'OK', onPress: () => {
                            this._onClickClose();
                        }}
                    ]
                );
            })
            .catch(this._catchError);
    }

    render() {
        return(
            <LoginKunnect onClickLogin={this._onClickLogin} onClickClose={this._onClickClose} isLoading={this.state.isLoading} />
        );
    }
}

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        dispatch: dispatch,
        actions: bindActionCreators(AppActions, dispatch)
    })
)(KunnectContainer);
