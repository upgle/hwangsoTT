import * as types from './actionTypes';
import { AsyncStorage } from 'react-native';

export function fetchAppData() {
  return (dispatch) => {
    return AsyncStorage.getItem('app_state')
      .then(state => {
        state = JSON.parse(state) || {};
        dispatch(replaceState(state));
      });
  };
}

export function saveAppData() {
  return (dispatch, getState) => {
    return AsyncStorage.setItem('app_state', JSON.stringify(getState()));
  };
}

export function toggleHeaderColorset() {
  return {
    type: types.TOGGLE_HEADER_COLORSET
  };
}

export function replaceState(state) {
  return {
    type: types.REPLACE_STATE,
    state : state
  };
}

export function removeAllCourses() {
  return {
    type: types.REMOVE_ALL_COURSE
  };
}

export function addCourse(id, subject, professor, classroom) {
  return {
    type: types.ADD_COURSE,
    course : {
      id : id,
      subject: subject,
      professor : professor,
      classroom : classroom
    }
  };
}

export function addCourses(courses) {
  return {
    type: types.ADD_COURSES,
    courses : courses
  };
}

export function addTime(course_id, day, start, end) {
  return {
    type: types.ADD_TIME,
    time : {
      course_id : course_id,
      day: day,
      start :start,
      end : end
    }
  };
}

export function addTimes(times) {
  return {
    type: types.ADD_TIMES,
    times : times
  };
}
