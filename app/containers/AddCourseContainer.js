
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AddCourse from '../components/AddCourse';
import {Actions} from 'react-native-router-flux';
import { saveAppData } from '../actions/appActions';
import {Alert} from 'react-native';

var uuid = require('uuid');

class AddCourseContainer extends Component {

    constructor(props) {
        super(props);
        this._onPressDone = this._onPressDone.bind(this);
    }

    componentWillMount() {
        Actions.refresh({
            onRight: this._onPressDone,
            rightTitle : "완료"
        });
    }

    _validation() {
        const component = this.refs.addCourse;
        const { state, times } = component;

        if(times.length === 0) {
            Alert.alert(
                '안내', '강의 시간을 한개이상 등록해주시기 바랍니다.',
                [
                    {text: '확인'}
                ]
            );
            return false;
        }

        if(state.subject.length === 0) {
            Alert.alert(
                '안내', '강의 이름을 입력해주시기 바랍니다.',
                [
                    {text: '확인'}
                ]
            );
            return false;
        }

        if(state.professor.length === 0) {
            Alert.alert(
                '안내', '교수명을 입력해주시기 바랍니다.',
                [
                    {text: '확인'}
                ]
            );
            return false;
        }

        if(state.classroom.length === 0) {
            Alert.alert(
                '안내', '강의실을 입력해주시기 바랍니다.',
                [
                    {text: '확인'}
                ]
            );
            return false;
        }

        return true;
    }

    _onPressDone() {
        const component = this.refs.addCourse;
        const { state, times } = component;
        const { actions } = this.props;

        component.closeModalAndKeyboard();

        if(this._validation() === false) {
            return false;
        }

        var course_id = uuid.v4();
        var cloneTimes = [];

        if(this.props.course_id) {
            course_id = this.props.course_id;
            actions.deleteAllTimesByCourseId(course_id);
        }
        else {
            actions.addCourse(course_id, state.subject, state.professor, state.classroom);
        }

        times.forEach((time) => {
            let data = Object.assign({course_id : course_id}, time);
            cloneTimes.push(data);
        });
        actions.addTimes(cloneTimes);

        this.props.dispatch(saveAppData());
        Actions.pop();
    }

    render() {

        const { state } = this.props;

        if(this.props.course_id) {
            let times = state.times.filter((time) => time.course_id === this.props.course_id),
                info = state.courses[this.props.course_id];

            return <AddCourse ref="addCourse"
                              times={times}
                              subject={info.subject}
                              professor={info.professor}
                              classroom={info.classroom} />;
        }
        return <AddCourse ref="addCourse"/>;
    }
}

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        dispatch: dispatch,
        actions: bindActionCreators(AppActions, dispatch)
    })
)(AddCourseContainer);

