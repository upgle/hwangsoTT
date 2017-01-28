
import * as types from '../../actions/actionTypes';
import _ from 'underscore';
import { THEME } from '../../config/theme';

const initialState = {
  courses: {},
  times: [],
  alarm: false,
  themeId: '0001',
  theme : THEME[0],
  user: null,
};

export function getTodayTimes(stateTimes) {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const date = new Date();
  return stateTimes.filter(time =>
    time.day === days[date.getDay()]
  );
}

export default function app(state = initialState, action) {

  switch (action.type) {

    case types.ON_ALARM :
      return Object.assign({}, state, { alarm : true });

    case types.OFF_ALARM :
      return Object.assign({}, state, { alarm : false });

    case types.ADD_COURSE : {
      const courses = Object.assign({}, state.courses, {
        [action.course.id]: {
          id: action.course.id,
          subject: action.course.subject,
          professor: action.course.professor,
          classroom: action.course.classroom,
        },
      });
      return Object.assign({}, state, {
        courses: courses,
      });
    }

    case types.ADD_COURSES :
      return Object.assign({}, state, {
        courses: Object.assign({}, state.courses, action.courses)
      });

    /**
     * Modify Course
     * course 정보를 수정합니다.
     */
    case types.MODIFY_COURSE_WITH_TIMES : {
      const filteredTimes = state.times.filter((time) => time.course_id !== action.course.id);
      const courses = Object.assign({}, state.courses, {
        [action.course.id]: {
          id: action.course.id,
          subject: action.course.subject,
          professor: action.course.professor,
          classroom: action.course.classroom,
        },
      });
      return Object.assign({}, state, {
        courses: courses,
        times: action.times.concat(filteredTimes),
      });
    }
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
        times: action.times.concat(state.times),
      });

    case types.DELETE_COURSE :
      {
        const courses = Object.assign({}, state.courses);
        delete courses[action.course_id];
        return Object.assign({}, state, {
          courses,
          times: state.times.filter((time) => time.course_id !== action.course_id),
        });
      }

    case types.DELETE_ALL_TIMES_BY_COURSE :
      {
        return Object.assign({}, state, {
          times: state.times.filter((time) => time.course_id !== action.course_id),
        });
      }

    case types.REMOVE_ALL_COURSE :
      return Object.assign({}, state, {
        times: [],
        courses: {},
      });

    case types.CHANGE_STATE :
      return Object.assign({}, state, action.state);

    case types.TOGGLE_HEADER_COLORSET : {
      const curIndex = _.findIndex(THEME, { header: state.theme.header });
      const nextIndex = (curIndex + 1) % THEME.length;
      return Object.assign({}, state, { theme: THEME[nextIndex] });
    }

    case types.SET_THEME : {
      const index = _.findIndex(THEME, { id: action.themeId });
      return Object.assign({}, state, {
        themeId: action.themeId,
        theme: THEME[index],
      });
    }

    case types.SIGN_IN :
      return Object.assign({}, state, { user : action.user });
      
    default:
      return state;
  }
}
