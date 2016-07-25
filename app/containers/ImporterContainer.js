
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Alert, StatusBar, Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ThirdPartyList from '../components/ThirdPartyList';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

const API_URL = 'https://yh5b9ynkb7.execute-api.ap-northeast-1.amazonaws.com/prod/services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
});


class ImporterContainer extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: '#303c4c',
    navBarTextColor: '#ffffff',
    navBarButtonColor: '#ffffff'
  };

  static navigatorButtons = {
    leftButtons: [
      {
        title: '취소',
        id: 'cancel',
      }
    ],
  };

  constructor(props) {
    super(props);

    this.state = {
      modalType: 'login',
      modalVisible: false,
      rowData: null,
      targetUrl: '',
      modalOkPressed: false,
    };
    this.onPressRow = this.onPressRow.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {

    if (event.type === 'DeepLink') {
      this.props.navigator.dismissLightBox();
      this.props.navigator.push({
        screen: 'WebviewContainer',
        passProps: {
          serviceId: this.state.rowData.id,
          apiUrl: `${API_URL}/${this.state.rowData.id}`,
          targetUrl: (event.link === 'login') ? null : event.link,
        }
      });
    }

    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'cancel') {
        this.props.navigator.dismissModal();
      }
    }
  }

  componentDidMount() {
    GoogleAnalytics.trackScreenView('시간표 불러오기 리스트');
  }

  componentWillMount() {
    StatusBar.setHidden(false, 'none');
  }

  componentWillUnmount() {
    StatusBar.setHidden(true, 'none');
  }

  onPressRow(rowData, sectionID) {

    this.setState({ rowData });

    if (rowData.type === 'login') {
      this.props.navigator.showLightBox({
        screen: 'ImporterLoginWarning',
        style: {
          backgroundBlur: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      });
    }

    if (rowData.type === 'permalink') {
      this.props.navigator.showLightBox({
        screen: 'ImporterPermalink',
        passProps: rowData.permalink,
        style: {
          backgroundBlur: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      });
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ThirdPartyList onPressRow={this.onPressRow} apiUrl={API_URL} />
      </View>
    );
  }
}

reactMixin(ImporterContainer.prototype, TimerMixin);


export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(ImporterContainer);
