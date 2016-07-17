import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import AddCourse from '../components/AddCourse';
import * as AppActions from '../actions/appActions';
const uuid = require('uuid');

class AddCourseContainer extends Component {

  constructor(props) {
    super(props);
    this.onPressDone = this.onPressDone.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
  }

  componentDidMount() {
    GoogleAnalytics.trackScreenView((this.props.course_id) ? '강의 수정' : '강의 추가');
  }

  componentWillMount() {
    Actions.refresh({
      onRight: this.onPressDone,
      rightTitle: '완료',
    });
  }

  onPressDone() {
    const component = this.refs.addCourse;
    component.closeModalAndKeyboard();

    if (this.validation() === false) {
      return false;
    }
    if (this.props.course_id) {
      this.modifyCourse();
    } else {
      this.insertCourse();
    }

    this.props.dispatch(AppActions.saveAppData());
    Actions.pop();
    return true;
  }

  modifyCourse() {
    const { state } = this.refs.addCourse;
    const courseId = this.props.course_id;
    const times = this.getTimesStructure(courseId);
    this.props.actions.modifyCourseWithTimes(courseId, state.subject, state.professor, state.classroom, times);
  }

  insertCourse() {
    const { state } = this.refs.addCourse;
    const { actions } = this.props;
    const courseId = uuid.v4();
    const times = this.getTimesStructure(courseId);
    actions.addCourse(courseId, state.subject, state.professor, state.classroom);
    actions.addTimes(times);
  }

  getTimesStructure(courseId) {
    const { times } = this.refs.addCourse;
    const cloneTimes = [];
    times.forEach((time) => {
      const data = Object.assign({ course_id: courseId }, time);
      cloneTimes.push(data);
    });
    return cloneTimes;
  }

  onPressDelete() {
    const { actions, course_id } = this.props;
    if (course_id) {
      Alert.alert(
        null,
        '이 강의를 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.',
        [
          { text: '취소' },
          { text: '확인', onPress: () => {
            actions.deleteCourse(course_id);
            this.props.dispatch(AppActions.saveAppData());
            Actions.pop();
          } },
        ]
      );
    }
  }

  validation() {
    const component = this.refs.addCourse;
    const { state, times } = component;

    if (times.length === 0) {
      this.alert('강의 시간을 한개이상 등록해주시기 바랍니다.');
      return false;
    }

    if (state.subject.length === 0) {
      this.alert('강의 이름을 입력해주시기 바랍니다.');
      return false;
    }

    if (state.professor.length === 0) {
      this.alert('교수명을 입력해주시기 바랍니다.');
      return false;
    }

    if (state.classroom.length === 0) {
      this.alert('강의실을 입력해주시기 바랍니다.');
      return false;
    }

    return true;
  }

  alert(message) {
    Alert.alert('안내', message, [{ text: '확인' }]);
  }

  render() {
    const { state } = this.props;

    if (this.props.course_id && state.courses[this.props.course_id]) {
      let times = state.times.filter((time) => time.course_id === this.props.course_id);
      let info = state.courses[this.props.course_id];

      return (
        <AddCourse
          ref="addCourse"
          showDeleteBtn={true}
          onPressDelete={this.onPressDelete}
          times={times}
          allTimes={state.times}
          subject={info.subject}
          professor={info.professor}
          classroom={info.classroom} />);
    }
    return <AddCourse ref="addCourse" allTimes={state.times} />;
  }
}

export default connect(state =>({
  state: state,
}), (dispatch) => ({
  dispatch: dispatch,
  actions: bindActionCreators(AppActions, dispatch),
})
)(AddCourseContainer);
