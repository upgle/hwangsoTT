import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert, View } from 'react-native';
import { saveAppData } from '../actions/appActions';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import Webview from '../components/thirdparty/Webview';

class WebviewContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      load: false,
      serviceData: null,
      defaultUrl: this.props.targetUrl ? this.props.targetUrl : '',
      injectedJavaScript: '',
    };
    this.onLoadData = this.onLoadData.bind(this);
  }

  componentDidMount() {
    GoogleAnalytics.trackScreenView(`시간표 불러오기 ${this.state.defaultUrl}`);
  }

  componentWillMount() {
    fetch(this.props.apiUrl)
      .then((response) => response.text())
      .then((responseData) => {
        try {
          let data = JSON.parse(responseData).results;
          let state = {
            injectedJavaScript: data.injectedJavaScript,
            load: true,
          };
          if (data.defaultUrl) {
            state.defaultUrl = data.defaultUrl;
          }
          this.setState(state);
        } catch (e) {
          Alert.alert(null, '데이터를 가져오는데 문제가 발생하였습니다.', [{ text: '확인' }]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onLoadData(courses, times) {
    const { actions } = this.props;
    const message = `총 ${Object.keys(courses).length}개의 과목을 발견하였습니다.\n시간표를 가져오시겠습니까?`;

    Alert.alert(
      '황소시간표',
      message,
      [
        { text: '취소' },
        {
          text: '확인',
          onPress: () => {
            actions.removeAllCourses();
            actions.addCourses(courses);
            actions.addTimes(times);
            this.props.dispatch(saveAppData());
            this.props.navigator.pop();
            Alert.alert('황소시간표', '시간표가 성공적으로 저장되었습니다.', [{ text: '확인' }]);
            GoogleAnalytics.trackEvent('importer', `시간표 로드 ${this.props.serviceId}`);
          },
        },
      ]
    );
  }

  render() {
    if (this.state.load === false) {
      return (
        <View></View>
      );
    }
    return (
      <Webview
        onLoadData={this.onLoadData}
        defaultUrl={this.state.defaultUrl}
        injectedJavaScript={this.state.injectedJavaScript} />
    );
  }
}
export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(WebviewContainer);
