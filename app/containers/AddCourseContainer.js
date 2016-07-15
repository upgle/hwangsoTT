
import React, {Component} from 'react';
import * as AppActions from '../actions/appActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AddCourse from '../components/AddCourse';

class AddCourseContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <AddCourse />
        );
    }
}

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        dispatch: dispatch,
        actions: bindActionCreators(AppActions, dispatch)
    })
)(AddCourseContainer);

