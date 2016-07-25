
import { NativeModules } from 'react-native';
import { RNS3 } from 'react-native-aws3';
const uuid = require('uuid');

export default class Kakao {

  constructor() {
    this.KakaoManager = NativeModules.KakaoManager;
  }

  isKakaoTalkInstalled(callback) {
    return this.KakaoManager.isKakaoTalkInstalled(callback);
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
        const imageUri = decodeURIComponent(response.body.postResponse.location);
        this.KakaoManager.sendImageWithText(imageUri, `http://hwangso.download/#/${id}`, '하단 버튼을 클릭하여 시간표를 확인할 수 있습니다.');
      });
    } catch (e) {
      console.log(e);
    }
  }
}