import { NativeModules } from 'react-native';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

export default class NaverLine {

  constructor() {
    this.NaverLineManager = NativeModules.NaverLineManager;
  }

  isLineInstalled(callback) {
    const _callback = (err, flag) => {
      GoogleAnalytics.trackEvent('sns', (flag === true) ? '라인 설치' : '라인 미설치');
      callback(err, flag);
    };
    this.NaverLineManager.isLineInstalled(_callback);
  }

  shareImage(imagePath) {
    GoogleAnalytics.trackEvent('sns', '라인 시간표 공유');
    this.NaverLineManager.shareImage(imagePath);
  }
}
