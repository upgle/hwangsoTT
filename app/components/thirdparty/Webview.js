import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView as RTWebView,
  Alert,
} from 'react-native';

export default class Webview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  onNavigationStateChange(data) {
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

    const INJECT = `
      var data;
      document.write("");
      var temp = $.ajax({
        dataType: 'json',
        url: 'https://www.kunnect.net/timetable/1/mycourse',
        success: function(response){
            data = response;
        },
        async: false
      });
      JSON.stringify(data) 
    `;

    const stepIdx = this.state.step;
    const step = [
      {
        guide: 'STEP 1. 로그인을 해주세요',
        uri: 'https://www.kunnect.net/login',
        injectedJavaScript: '',
        nextCondition: (nativeEvent) => nativeEvent.url === 'https://www.kunnect.net/',
      },
      {
        uri: 'https://www.kunnect.net',
        injectedJavaScript: INJECT,
        nextCondition: null,

        parsingScript: (response) => {

          const dayOfTheWeek = {
            월: 'MON',
            화: 'TUE',
            수: 'WED',
            목: 'THU',
            금: 'FRI',
            토: 'SAT',
            일: 'SUN',
          };

          const timeStarts = {
            0: '08:00',
            1: '09:00',
            2: '09:30',
            3: '10:00',
            4: '10:30',
            5: '11:00',
            6: '11:30',
            7: '12:00',
            8: '12:30',
            9: '13:00',
            10: '13:30',
            11: '14:00',
            12: '14:30',
            13: '15:00',
            14: '15:30',
            15: '16:00',
            16: '16:30',
            17: '17:00',
            18: '17:30',
            19: '18:15',
            20: '19:00',
            21: '19:45',
            22: '20:30',
            23: '21:15',
          };

          const timeEnds = {
            0: '09:00',
            1: '09:30',
            2: '10:00',
            3: '10:30',
            4: '11:00',
            5: '11:30',
            6: '12:00',
            7: '12:30',
            8: '13:00',
            9: '13:30',
            10: '14:00',
            11: '14:30',
            12: '15:00',
            13: '15:30',
            14: '16:00',
            15: '16:30',
            16: '17:00',
            17: '17:30',
            18: '18:00',
            19: '19:00',
            20: '19:45',
            21: '20:30',
            22: '21:15',
            23: '22:00',
          };
          function TimeConverter(timeStart, timeEnd) {
            return {
              start: timeStarts[timeStart],
              end: timeEnds[timeEnd]
            };
          }
          function YoilConverter(yoil) {
            return dayOfTheWeek[yoil];
          }
          let courses = {};
          let times = [];

          response.returns.forEach((data) => {
            var time = TimeConverter(data.timeStart, data.timeEnd);

            courses[data.sbjtId] = {
              id : data.sbjtId,
              subject: data.subject,
              professor : data.prof,
              classroom : data.building + data.classroom
            };
            times = [{
              course_id : data.sbjtId,
              day: YoilConverter(data.yoil),
              start: time.start,
              end: time.end,
            }, ...times];
          });
          return {
            courses,
            times,
          };
        },
        isLastStep: true,
      },
    ];

    return(
      <View style={styles.container}>
        <View style={{ backgroundColor: '#ffefbe', paddingVertical: 15, paddingLeft: 20 }}>
          <Text>STEP 1. 로그인을 해주세요</Text>
        </View>
        <RTWebView
          source={ step[stepIdx].uri ? { uri: step[stepIdx].uri } : { html: step[stepIdx].html }}
          style={{ flex: 1 }}
          onNavigationStateChange={
            (nativeEvent) => {
              this.onNavigationStateChange({
                nativeEvent,
                nextCondition: step[stepIdx].nextCondition,
                isLastStep: step[stepIdx].isLastStep === true,
                parsingScript: step[stepIdx].parsingScript,
              });
            }
          }
          injectedJavaScript={step[stepIdx].injectedJavaScript}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});