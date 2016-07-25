
import { NativeModules } from 'react-native';
import { RNS3 } from 'react-native-aws3';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
const uuid = require('uuid');

export default class Kakao {

  constructor() {
    this.KakaoManager = NativeModules.KakaoManager;
  }

  isKakaoTalkInstalled(callback) {
    const _callback = (err, flag) => {
      GoogleAnalytics.trackEvent('sns', (flag === true) ? '카카오톡 설치' : '카카오톡 미설치');
      callback(err, flag);
    };
    return this.KakaoManager.isKakaoTalkInstalled(_callback);
  }

  shareTimetableImage(imagePath) {
    const id = uuid.v4().slice(0, 13);
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: imagePath,
      name: `${id}.png`,
      type: 'image/png',
    };
    const options = {
      keyPrefix: 'timetable/',
      bucket: 'hwangso',
      region: 'ap-northeast-2',
      accessKey: 'AKIAJ6DDOHPO4WGER7NA',
      secretKey: '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',
      successActionStatus: 201,
    };
    try {
      RNS3.put(file, options).then(response => {
        if (response.status !== 201) {
          throw new Error('Failed to upload image to S3');
        }
        GoogleAnalytics.trackEvent('sns', '카카오톡 시간표 공유');
        const imageUri = decodeURIComponent(response.body.postResponse.location);
        this.KakaoManager.sendImageWithText(imageUri, `http://hwangso.download/#/${id}`, '하단 버튼을 클릭하여 시간표를 확인할 수 있습니다.');
      });
    } catch (e) {
      // @TODO EXCEPTION 처리
      // console.log(e);
    }
  }
}