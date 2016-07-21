
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Alert, StatusBar, Modal, View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import ThirdPartyList from '../components/ThirdPartyList';
import { Actions } from 'react-native-router-flux';
import { TimeConverter, YoilConverter } from '../util/kunnect';
import { saveAppData } from '../actions/appActions';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import * as Modals from '../components/modals';

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
class LoadDataContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalType: 'login',
      modalVisible: false,
      activeRowId: null,
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

  onPressModalOk() {
    this.setModalVisible(false);
    Actions.loadTimetableWebview({
      apiUrl: `${API_URL}/${this.state.activeRowId}`,
    });
  }

  onPressRow(rowData, sectionID) {
    this.setState({
      modalType: rowData.type,
      modalVisible: true,
      activeRowId: rowData.id,
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    const modalBackgroundStyle = { backgroundColor: 'rgba(0, 0, 0, 0.5)' };
    const modalBody =
      (this.state.modalType === 'login') ?
        <Modals.AuthGuideModal onPressButton={this.onPressModalOk} /> :
        <Modals.PermalinkGuideModal onPressButton={this.onPressModalOk} />;

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
)(LoadDataContainer);
