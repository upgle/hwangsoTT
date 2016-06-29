
import * as types from '../actions/actionTypes';

const initialState = {
  courses: {},
  times: [],
  headerColor : '#3EBFBA'
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

    case types.ADD_TIME :
      return Object.assign({}, state, {
        times: [{
          course_id : action.time.course_id,
          day: action.time.day,
          start: action.time.start,
          end: action.time.end,
        }, ...state.times]
      });

    case types.REMOVE_ALL_COURSE :
      return Object.assign({}, state, {
        times : [],
        courses : {},
      });

    case types.REPLACE_STATE :
      return Object.assign({}, state, action.state);

    case types.TOGGLE_HEADER_COLORSET :
      return Object.assign({}, state, {
        headerColor : action.color
      });

    default:
      return state;
  }
}
