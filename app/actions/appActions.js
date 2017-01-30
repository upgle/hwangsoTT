import * as types from './actionTypes';
import { AsyncStorage } from 'react-native';

export function turnOnAlarm() {
  return { type: types.ON_ALARM };
}

export function turnOffAlarm() {
  return { type: types.OFF_ALARM };
}

export function changeState(state) {
  return {
    type: types.CHANGE_STATE,
    state,
  };
}

export function removeAllCourses() {
  return { type: types.REMOVE_ALL_COURSE };
}

export function addCourse(id, subject, professor, classroom) {
  return {
    type: types.ADD_COURSE,
    course : {
      id : id,
      subject: subject,
      professor : professor,
      classroom : classroom,
    }
  };
}

export function setTheme(themeId) {
  return {
    type: types.SET_THEME,
    themeId: themeId,
  };
}

export function modifyCourseWithTimes(id, subject, professor, classroom, times) {
  return {
    type: types.MODIFY_COURSE_WITH_TIMES,
    course: {
      id: id,
      subject: subject,
      professor: professor,
      classroom: classroom,
    },
    times: times,
  };
}

export function addCourses(courses) {
  return {
    type: types.ADD_COURSES,
    courses : courses,
  };
}

export function addTime(course_id, day, start, end) {
  return {
    type: types.ADD_TIME,
    time : {
      course_id : course_id,
      day: day,
      start :start,
      end : end,
    }
  };
}

export function addTimes(times) {
  return {
    type: types.ADD_TIMES,
    times : times,
  };
}

export function deleteAllTimesByCourseId(course_id) {
  return {
    type: types.DELETE_ALL_TIMES_BY_COURSE,
    course_id : course_id,
  };
}

export function deleteCourse(course_id) {
  return {
    type: types.DELETE_COURSE,
    course_id : course_id,
  };
}
