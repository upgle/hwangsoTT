import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    StatusBar
} from 'react-native';


export default class AddCourse extends Component {

    componentWillMount() {
        StatusBar.setHidden(false, 'none');
    }

    componentWillUnmount() {
        StatusBar.setHidden(true, 'none');
    }

    render() {

        return (

            <View>
                <Text>Hello World</Text>
            </View>
        );
    }

}