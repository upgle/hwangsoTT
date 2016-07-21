import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView as RTWebView,
  Alert,
  TextInput,
} from 'react-native';

export default class Webview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      guide: null,
      url: 'https://www.kunnect.net/login',
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
      injectedJavaScript: '',
    };
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
  }

  componentDidMount() {

    this.setState({
      injectedJavaScript:
      `
      $(document).ajaxSuccess(function(event, request, setting) {
        if (!setting.url.includes('/timetable/')) return;
      
        var response = request.responseJSON;
        var dayOfTheWeek = { 월: 'MON', 화: 'TUE', 수: 'WED', 목: 'THU', 금: 'FRI', 토: 'SAT', 일: 'SUN' };
        var timeSet = {
          0: '08:00', 1: '09:00', 2: '09:30', 3: '10:00', 4: '10:30', 5: '11:00',
          6: '11:30', 7: '12:00', 8: '12:30', 9: '13:00', 10: '13:30', 11: '14:00',
          12: '14:30', 13: '15:00', 14: '15:30', 15: '16:00', 16: '16:30', 17: '17:00',
          18: '17:30', 19: '18:15', 20: '19:00', 21: '19:45', 22: '20:30', 23: '21:15', 24: '22:00'
        };
        function TimeConverter(timeStart, timeEnd) {
          return {
            start: timeSet[timeStart],
            end: timeSet[Number.parseInt(timeEnd) + 1]
          };
        }
        var courses = {};
        var times = [];
        response.returns.forEach(function (data) {
          var time = TimeConverter(data.timeStart, data.timeEnd);
          courses[data.sbjtId] = {
            id: data.sbjtId,
            subject: data.subject,
            professor: data.prof,
            classroom: data.building + data.classroom
          };
          times = [{
            course_id: data.sbjtId,
            day: dayOfTheWeek[data.yoil],
            start: time.start,
            end: time.end
          }].concat(times);
        });
        window.location = 'hwangso://' + encodeURIComponent(JSON.stringify({ courses: courses, times: times }));
      });
      `,
    });
  }

  _onNavigationStateChange(data) {
    const { nativeEvent, nextCondition, isLastStep, parsingScript } = data;
    const { jsEvaluationValue } = nativeEvent;
    const isString = (str) => typeof str === 'string' || str instanceof String;

    /**
     * Data 인 경우 파싱 처리
     */
    if (isLastStep === true && isString(jsEvaluationValue)) {

      try {
        // console.log(jsEvaluationValue);
        const { courses, times } = parsingScript(JSON.parse(jsEvaluationValue));
        this.validation(courses, times);

        this.props.onLoadData(courses, times);

      } catch(e) {
        Alert.alert('시간표 가져오기 실패', '빠른 시일내에 복구하도록 하겠습니다.', [{ text: '확인' }]);
      }
      return;
    }

    /**
     * Data가 아닌 경우
     */
    if (typeof nextCondition === 'function') {
      const result = nextCondition(nativeEvent);
      if (result === true) {
        this.setState({
          step: this.state.step + 1,
        });
      }
    }
  }

  onShouldStartLoadWithRequest(nativeEvent) {
    if (nativeEvent.url.includes('hwangso://')) {
      let data = nativeEvent.url.replace('hwangso://', '');
      const { courses, times } = JSON.parse(decodeURIComponent(data));
      this.props.onLoadData(courses, times);

      // console.log(JSON.parse());
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
        {/*<View style={styles.address}>*/}
          {/*<TextInput style={styles.addressTextInput} value={this.state.url} editable={false} />*/}
        {/*</View>*/}
        <RTWebView
          ref='webview'
          source={{ uri: this.state.url }}
          style={{ flex: 1, }}
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
