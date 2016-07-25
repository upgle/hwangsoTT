import * as actionTypes from '../actions/actionTypes';
import LocalNotification from '../services/notification/LocalNotification';

export const alarmMiddleware = store => next => action => {
  const returnValue = next(action);
  const { alarm, courses, times } = store.getState();
  const LocalNotificationService = new LocalNotification();

  switch (action.type) {
    case actionTypes.MODIFY_COURSE_WITH_TIMES:
    case actionTypes.ADD_TIMES:
    case actionTypes.ADD_TIME:
    case actionTypes.DELETE_ALL_TIMES_BY_COURSE:
      if (alarm === true) {
        LocalNotificationService.setTimetableNotifications(courses, times);
      }
      break;
    default :
      break;
  }
  return returnValue;
};
