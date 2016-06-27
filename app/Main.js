import React, { Component } from 'react';
import {
 AppRegistry,
 StyleSheet,
 Text,
 View,
 StatusBar,
 findNodeHandle,
} from 'react-native';
import Drawer from 'react-native-drawer'
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewSnapshotter from 'react-native-view-snapshot';

import TimeTableWithHeader from './TimeTableWithHeader';
import SideMenu from './SideMenu';

class Main extends Component {

  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content', true);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  captureTimetable() {
    ViewSnapshotter.saveSnapshotToPath(findNodeHandle(this.refs.timetable), '');
  }

  openDrawer() {
    this._drawer.open()
  }

  closeDrawer() {
    this._drawer.close();
  }

  render() {
    return (
      <Drawer
      type="static"
      content={<SideMenu {...this.props} closeDrawer={this.closeDrawer} />}
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
          <TimeTableWithHeader onClickMenu={this.openDrawer} ref='timetable'/>
      </Drawer>
    );
  }
}

module.exports = Main;

const drawerStyles = {
  main: {shadowColor: '#000000', shadowOpacity: 0.6, shadowRadius: 5},
};
