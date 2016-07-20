
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Alert, StatusBar } from 'react-native';
import ThirdPartyList from '../components/ThirdPartyList';
import { Actions } from 'react-native-router-flux';
import { TimeConverter, YoilConverter } from '../util/kunnect';
import { saveAppData } from '../actions/appActions';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

class LoadDataContainer extends Component {

  constructor(props) {
    super(props);
    this.onPressRow = this.onPressRow.bind(this);
  }

  componentWillMount() {
    StatusBar.setHidden(false, 'none');
  }

  componentWillUnmount() {
    StatusBar.setHidden(true, 'none');
  }

  onPressRow(rowData, sectionID) {
    Actions.loadTimetableWebview();
  }

  render() {
    return (
      <ThirdPartyList onPressRow={this.onPressRow} />
    );
  }
}
export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(LoadDataContainer);
