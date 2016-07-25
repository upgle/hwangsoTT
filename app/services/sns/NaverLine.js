
import { NativeModules } from 'react-native';

export default class NaverLine {

  constructor() {
    this.NaverLineManager = NativeModules.NaverLineManager;
  }

  isLineInstalled(callback) {
    this.NaverLineManager.isLineInstalled(callback);
  }

  shareImage(imagePath) {
    this.NaverLineManager.shareImage(imagePath);
  }

}