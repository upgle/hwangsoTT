import { PushNotificationIOS } from 'react-native';

export const DAYS = {
  MON : 1,
  TUE : 2,
  WED : 3,
  THU : 4,
  FRI : 5,
  SAT : 6,
  SUN : 7
};

export function clearAllAlarm() {
    PushNotificationIOS.cancelAllLocalNotifications();
}

export function setAlarmFromTimes(courses, times) {

  clearAllAlarm();
  for (var i = 0; i < times.length; i++) {
    var time = times[i].start.split(':');
    var hour = time[0],
        minute = time[1];

    var message = courses[times[i].course_id].subject + " 수업 시작 15분 전입니다.";
    var day = DAYS[times[i].day];

    minute = minute - 15;
    if(minute < 0) {
      minute = 60 + minute;
      hour = hour - 1;
    }
    setAlarm(message, day, hour, minute);
  }
}

export function setAlarm(message, day = 1, hour = 0, minute = 0, second = 0) {
  PushNotificationIOS.scheduleLocalNotification({
    fireDate: (new Date(2016, 1, day, hour, minute, second)).getTime(), // 2016-02-01 Mon
    alertBody : message
  });
}
