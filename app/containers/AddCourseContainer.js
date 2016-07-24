import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import AddCourse from '../components/AddCourse';
import * as AppActions from '../actions/appActions';
const uuid = require('uuid');

class AddCourseContainer extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: '#303c4c',
    navBarTextColor: '#ffffff',
    navBarButtonColor: '#ffffff'
  };

  static navigatorButtons = {
    leftButtons: [
      {
        title: '취소',
        id: 'cancel',
      }
    ],
    rightButtons: [
      {
        title: '저장', // for a textual button, provide the button title (label)
        id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      }
    ]
  };

  constructor(props) {
    super(props);
    this.onPressDone = this.onPressDone.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'cancel') {
        this.props.navigator.dismissModal();
      }
      if (event.id === 'save') {
        this.onPressDone();
      }
    }
  }

  componentDidMount() {
    GoogleAnalytics.trackScreenView((this.props.course_id) ? '강의 수정' : '강의 추가');
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
    this.props.navigator.dismissModal();
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
            this.props.navigator.dismissModal();
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
    const { app } = this.props.state;

    if (this.props.course_id && app.courses[this.props.course_id]) {
      let times = app.times.filter((time) => time.course_id === this.props.course_id);
      let info = app.courses[this.props.course_id];

      return (
        <AddCourse
          ref="addCourse"
          showDeleteBtn={true}
          onPressDelete={this.onPressDelete}
          times={times}
          allTimes={app.times}
          subject={info.subject}
          professor={info.professor}
          classroom={info.classroom} />);
    }
    return <AddCourse ref="addCourse" allTimes={app.times} />;
  }
}

export default connect(state =>({
  state: state,
}), (dispatch) => ({
  dispatch: dispatch,
  actions: bindActionCreators(AppActions, dispatch),
})
)(AddCourseContainer);
