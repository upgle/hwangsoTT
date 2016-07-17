import * as actionTypes from '../actions/actionTypes';
import { setAlarmFromTimes } from '../util/alarmManager';

export const loggerMiddleware = store => next => action => {

  const returnValue = next(action);
  const { alarm, courses, times } = store.getState();

  switch (action.type) {
    case actionTypes.MODIFY_COURSE_WITH_TIMES:
    case actionTypes.ADD_TIMES:
    case actionTypes.ADD_TIME:
    case actionTypes.DELETE_ALL_TIMES_BY_COURSE:
      if (alarm === true) {
        setAlarmFromTimes(courses, times);
      }
      break;
    default :
      break;
  }
  return returnValue;
};
