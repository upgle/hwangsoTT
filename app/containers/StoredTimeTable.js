
import React, { Component } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';

import TimeTable from '../components/TimeTable';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

import * as Actions from '../actions/appActions';

import {getTodayTimes} from '../reducers/timetableApp';

var screen = Dimensions.get('window');

class StoredTimeTable extends Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    StatusBar.setHidden(false, 'none');
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    this._drawer.close();
  }

  render() {
    const { state, actions } = this.props;

    return (
      <Drawer
      type="static"
      content={<SideMenu {...this.props} closeDrawer={this.closeDrawer} {...actions} />}
      openDrawerOffset={0.4}
      styles={drawerStyles}
      panOpenMask={0.45}
      tweenHandler={Drawer.tweenPresets.parallax}
      tapToClose={true}
      onOpenStart={()=>{
        StatusBar.setHidden(true, 'slide');
      }}
      onCloseStart={()=>{
        StatusBar.setHidden(false, 'slide');
      }}
      ref={(ref) => this._drawer = ref} >
        <Header
          color={state.headerColor}
          courses={state.courses}
          todayTimes={getTodayTimes(state.times)}
          onClickMenu={this.openDrawer}
        />
        <TimeTable
          courses={state.courses}
          times={state.times}
          {...actions}
          height={screen.height - 124}
        />
      </Drawer>
    );
  }
}

export default connect(state => ({
    state: state
  }),
  (dispatch) => ({
    dispatch: dispatch,
    actions: bindActionCreators(Actions, dispatch)
  })
)(StoredTimeTable);


const drawerStyles = {
  main: {shadowColor: '#000000', shadowOpacity: 0.6, shadowRadius: 5},
};
