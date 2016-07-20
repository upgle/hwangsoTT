import React, {Component} from 'react';
import * as AppActions from '../../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Alert} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { TimeConverter, YoilConverter } from '../../util/kunnect';
import { saveAppData } from '../../actions/appActions';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import Webview from '../../components/thirdparty/Webview';

class WebviewContainer extends Component {

  constructor(props) {
    super(props);
    this.onLoadData = this.onLoadData.bind(this);
  }

  onLoadData(courses, times) {
    console.log(courses, times);
  }

  render() {
    return (
      <Webview onLoadData={this.onLoadData} />
    );
  }
}
export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(WebviewContainer);
