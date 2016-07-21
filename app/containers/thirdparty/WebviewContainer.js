import React, {Component} from 'react';
import * as AppActions from '../../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactNative, { Alert, View } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { TimeConverter, YoilConverter } from '../../util/kunnect';
import { saveAppData } from '../../actions/appActions';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import Webview from '../../components/thirdparty/Webview';

class WebviewContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      serviceData: null,
    };
    this.onLoadData = this.onLoadData.bind(this);
  }

  componentWillMount() {
    //
    // const _data = ({
    //   results: {
    //     step: [{
    //       guide: 'STEP 1. 시간표의 고유번호를 입력해주세요',
    //       uri: 'https://hwangso.github.io/importerBridge/snutt.html',
    //       injectedJavaScript: '',
    //       nextCondition: function nextCondition(nativeEvent) {
    //         return nativeEvent.url === 'https://www.kunnect.net/';
    //       }
    //     }, {
    //       guide: 'STEP 2. 데이터 분석중입니다.',
    //       uri: 'https://www.kunnect.net',
    //       injectedJavaScript: '\n            var data;\n            document.write("");\n            var temp = $.ajax({\n              dataType: \'json\',\n              url: \'https://www.kunnect.net/timetable/1/mycourse\',\n              success: function(response){\n                  data = response;\n              },\n              async: false\n            });\n            JSON.stringify(data) \n            ',
    //       nextCondition: null,
    //       parsingScript: function parsingScript(response) {
    //         var dayOfTheWeek = { 월: 'MON', 화: 'TUE', 수: 'WED', 목: 'THU', 금: 'FRI', 토: 'SAT', 일: 'SUN' };
    //         var timeSet = {
    //           0: '08:00', 1: '09:00', 2: '09:30', 3: '10:00', 4: '10:30', 5: '11:00',
    //           6: '11:30', 7: '12:00', 8: '12:30', 9: '13:00', 10: '13:30', 11: '14:00',
    //           12: '14:30', 13: '15:00', 14: '15:30', 15: '16:00', 16: '16:30', 17: '17:00',
    //           18: '17:30', 19: '18:15', 20: '19:00', 21: '19:45', 22: '20:30', 23: '21:15', 24: '22:00'
    //         };
    //         function TimeConverter(timeStart, timeEnd) {
    //           return {
    //             start: timeSet[timeStart],
    //             end: timeSet[Number.parseInt(timeEnd) + 1]
    //           };
    //         }
    //         var courses = {};
    //         var times = [];
    //         response.returns.forEach(function (data) {
    //           var time = TimeConverter(data.timeStart, data.timeEnd);
    //           courses[data.sbjtId] = {
    //             id: data.sbjtId,
    //             subject: data.subject,
    //             professor: data.prof,
    //             classroom: data.building + data.classroom
    //           };
    //           times = [{
    //             course_id: data.sbjtId,
    //             day: dayOfTheWeek[data.yoil],
    //             start: time.start,
    //             end: time.end
    //           }].concat(times);
    //         });
    //         return {
    //           courses: courses,
    //           times: times
    //         };
    //       },
    //       isLastStep: true
    //     }]
    //   }
    // });
    // this.setState({ serviceData: _data.results });
    //
    // return;

    // fetch(this.props.apiUrl).then((response) => response.text()).then((responseData) => {
    //   /**
    //    * Eval 함수 사용에 따른 예외 처리 필요.
    //    * catch(e) 쪽에서 예외처리 해주면 됨
    //    */
    //   try {
    //     const data = eval('(' + responseData + ')');
    //     this.setState({ serviceData: data.results });
    //   } catch (e) {
    //     Alert.alert(null, '데이터를 가져오는데 문제가 발생하였습니다.', [{ text: '확인' }]);
    //   }
    // })
    // /**
    //  * Promise 사용에 따른 예외처리
    //  */
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  onLoadData(courses, times) {
    const message = `총 ${Object.keys(courses).length}개의 과목을 발견하였습니다.\n시간표를 가져오시겠습니까?`;
    Alert.alert('황소시간표', message, [{ text: '확인' }, { text: '취소' }]);
  }

  render() {

    return (
      <Webview onLoadData={this.onLoadData} service={this.state.serviceData} />
    );
  }
}
export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(WebviewContainer);
