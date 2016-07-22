import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  WebView as RTWebView,
} from 'react-native';

export default class Webview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      guide: null,
      url: this.props.defaultUrl ? this.props.defaultUrl : '',
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
      injectedJavaScript: this.props.injectedJavaScript ? this.props.injectedJavaScript : '',
    };
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
  }

  onShouldStartLoadWithRequest(nativeEvent) {
    if (nativeEvent.url.includes('hwangso://')) {
      let data = nativeEvent.url.replace('hwangso://', '');
      const { courses, times } = JSON.parse(decodeURIComponent(data));
      this.validation(courses, times);
      this.props.onLoadData(courses, times);

      return false;
    }
    return true;
  }

  onNavigationStateChange(nativeEvent) {

    this.setState({
      backButtonEnabled: nativeEvent.canGoBack,
      forwardButtonEnabled: nativeEvent.canGoForward,
      url: nativeEvent.url,
      status: nativeEvent.title,
      loading: nativeEvent.loading,
      scalesPageToFit: true,
    });
  }

  validation(courses, times) {
    const isObject = (A) => ((typeof A === 'object') && (A !== null));
    if (!isObject(courses)) {
      throw new Error('Invalid Data (courses is not object)');
    }
    times.forEach(time => {
      if (['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].indexOf(time.day) === -1) {
        throw new Error('Invalid Data (day value is invalid)');
      }
      if (!isObject(courses[time.course_id])) {
        throw new Error('Invalid Data (not object)');
      }
      if (!(/[0-9]{2}:[0-9]{2}/).test(time.start)) {
        throw new Error('Invalid Data (start time is invalid)');
      }
      if (!(/[0-9]{2}:[0-9]{2}/).test(time.end)) {
        throw new Error('Invalid Data (start time is invalid)');
      }
    });
  }

  render() {
    return(
      <View style={styles.container}>
        <RTWebView
          source={{ uri: this.state.url }}
          style={{ flex: 1 }}
          onNavigationStateChange={this.onNavigationStateChange}
          injectedJavaScript={this.state.injectedJavaScript}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edeef0',
  },
  guideTextBig: {
    fontWeight: '500',
    fontSize: 19,
    marginBottom: 3,
    color: '#333333',
  },
  address: {
    height: 36,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#303c4c',
  },
  addressTextInput: {
    height: 36,
    fontSize: 13,
    color: '#666666',
  },
  blur: {
    backgroundColor: '#f5f9ff',
    height: 96,
    shadowColor: "#999999",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      height: -2,
      width: 0
    },
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});
