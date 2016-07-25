import { PushNotificationIOS } from 'react-native';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

const DAYS = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7 };

export default class LocalNotification {

  clearAllNotification() {

    GoogleAnalytics.trackEvent('notification', '모든 로컬 알람 제거');

    PushNotificationIOS.cancelAllLocalNotifications();
  }

  setNotification(message, day = 1, hour = 0, minute = 0, second = 0) {

    GoogleAnalytics.trackEvent('notification', '로컬 알람 단일 등록');

    PushNotificationIOS.scheduleLocalNotification({
      fireDate: (new Date(2016, 1, day, hour, minute, second)).getTime(), // 2016-02-01 Mon
      alertBody: message,
    });
  }

  setTimetableNotifications(courses = {}, times = []) {

    GoogleAnalytics.trackEvent('notification', '모든 강의 로컬 알람 등록');

    // 기존의 LocalNotifications를 모두 제거
    this.clearAllNotification();

    for (let i = 0; i < times.length; i++) {
      const time = times[i].start.split(':');
      let hour = time[0];
      let minute = time[1];
      const subject = courses[times[i].course_id].subject;
      const message = `${subject} 수업 시작 15분 전입니다.`;
      const day = DAYS[times[i].day];

      minute = minute - 15;
      if (minute < 0) {
        minute = 60 + minute;
        hour = hour - 1;
      }
      this.setNotification(message, day, hour, minute);
    }
  }
}
