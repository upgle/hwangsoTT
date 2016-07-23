
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Alert, StatusBar, Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ThirdPartyList from '../components/ThirdPartyList';
import { Actions } from 'react-native-router-flux';
import { saveAppData } from '../actions/appActions';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import { AuthGuideModal, PermalinkGuideModal } from '../components/modals';

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

//TODO : IMPORTER 로 이름 변경
class ImporterContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalType: 'login',
      modalVisible: false,
      rowData: null,
    };
    this.onPressModalOk = this.onPressModalOk.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillMount() {
    StatusBar.setHidden(false, 'none');
  }

  componentWillUnmount() {
    StatusBar.setHidden(true, 'none');
  }

  onPressModalOk(url) {
    this.setModalVisible(false);
    Actions.loadTimetableWebview({
      apiUrl: `${API_URL}/${this.state.rowData.id}`,
      targetUrl: url,
    });
  }

  onPressRow(rowData, sectionID) {
    this.setState({
      modalType: rowData.type,
      modalVisible: true,
      rowData,
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    const modalBackgroundStyle = { backgroundColor: 'rgba(0, 0, 0, 0.5)' };

    let modalBody;
    if (this.state.modalType === 'login') {
      modalBody = <AuthGuideModal onPressButton={this.onPressModalOk} onPressClose={()=>{this.setModalVisible(false)}} />;
    }
    if (this.state.modalType === 'permalink') {
      const { permalink } = this.state.rowData;
      modalBody =
        <PermalinkGuideModal
          onPressButton={this.onPressModalOk}
          placeholder={permalink.placeholder}
          onFocusDefault={permalink.onFocusDefault}
          onPressClose={()=>{this.setModalVisible(false)}}
          regex={permalink.regex}
        />;
    }
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false)}}
        >
            <View style={[styles.container, modalBackgroundStyle]}>
              {modalBody}
            </View>
        </Modal>
        <ThirdPartyList onPressRow={this.onPressRow} apiUrl={API_URL} />
      </View>
    );

  }
}
export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(ImporterContainer);
