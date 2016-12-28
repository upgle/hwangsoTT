import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ThemeStore from '../components/ThemeStore';
import * as AppActions from '../actions/appActions';

const navigatorStyle = {
  navBarHidden: true,
  navBarBackgroundColor: '#303c4c',
  navBarTextColor: '#ffffff',
  navBarButtonColor: '#ffffff',
};

class ThemeStoreContainer extends Component {

  constructor(props) {
    super(props);
    this.onPressCloseButton = this.onPressCloseButton.bind(this);
    this.onPressSetTheme = this.onPressSetTheme.bind(this);
  }

  onPressCloseButton() {
    this.props.navigator.dismissModal();
  }

  onPressSetTheme(themeId) {
    const { actions } = this.props;
    actions.setTheme(themeId);
    this.props.navigator.dismissModal();
  }

  render() {
    return <ThemeStore
      app={this.props.state.app}
      onPressCloseButton={this.onPressCloseButton}
      onPressSetTheme={this.onPressSetTheme}
    />;
  }
}
ThemeStoreContainer.navigatorStyle = navigatorStyle;

export default connect(state => ({ state }),
  (dispatch) => ({
    dispatch,
    actions: bindActionCreators(AppActions, dispatch),
  })
)(ThemeStoreContainer);
