import * as types from './actionTypes';

export function getAllDataFromStorage() {

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
