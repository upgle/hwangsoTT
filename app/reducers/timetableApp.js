
import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  courses: {},
  times: [],
  alarm: false,
  headerColor : '#634dc7'
};

export function getTodayTimes(stateTimes) {

  var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      date = new Date();

  return stateTimes.filter(time =>
    time.day === days[date.getDay()]
  );
}

export default function timetableApp(state = initialState, action) {
  switch (action.type) {

    case types.ON_ALARM :
      return Object.assign({}, state, {
        alarm : true
      });

    case types.OFF_ALARM :
      return Object.assign({}, state, {
        alarm : false
      });

    case types.ADD_COURSE :

      var courses = Object.assign({}, state.courses, {
        [action.course.id]: {
          id : action.course.id,
          subject: action.course.subject,
          professor : action.course.professor,
          classroom : action.course.classroom
        }
      });
      return Object.assign({}, state, {
        courses: courses
      });

    case types.ADD_COURSES :
      return Object.assign({}, state, {
        courses: Object.assign({}, state.courses, action.courses)
      });

    case types.ADD_TIME :
      return Object.assign({}, state, {
        times: [{
          course_id : action.time.course_id,
          day: action.time.day,
          start: action.time.start,
          end: action.time.end,
        }, ...state.times]
      });

    case types.ADD_TIMES :
      return Object.assign({}, state, {
        times: action.times.concat(state.times)
      });

    case types.REMOVE_ALL_COURSE :
      return Object.assign({}, state, {
        times : [],
        courses : {},
      });

    case types.REPLACE_STATE :
      return Object.assign({}, state, action.state);

    case types.TOGGLE_HEADER_COLORSET :

      var colorSet = ['#3EBFBA', '#634DC7', '#E18794', '#40B2D7', '#4D4E71', '#FE4365'];
      var curIndex = _.indexOf(colorSet, state.headerColor);
      var nextIndex = (curIndex+1) % colorSet.length;

      return Object.assign({}, state, {
        headerColor : colorSet[nextIndex]
      });

    default:
      return state;
  }
}
