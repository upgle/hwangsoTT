import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { MKTextField } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import LightBoxButton from '../../components/LightBoxButton';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width,
    padding: 30,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  modalButton: {
    marginTop: 10,
  },
});


export default class ImporterLoginWarning extends Component {

  constructor(props) {
    super(props);
    this.onPressDismiss = this.onPressDismiss.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
  }

  onPressButton() {
    this.props.navigator.handleDeepLink({ link: 'login' });
  }

  onPressDismiss() {
    this.props.navigator.dismissLightBox();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TouchableHighlight onPress={this.onPressDismiss} underlayColor="transparent" style={{position: 'absolute', top: -40, right: -10, backgroundColor: 'transparent', paddingHorizontal: 15 }}>
            <Icon name="ios-close" color="rgba(255, 255, 255, 0.7)" size={40} />
          </TouchableHighlight>
          <Icon name="ios-warning" color="#7b4fea" size={50} style={{marginVertical: 13}}/>
          <Text style={{ textAlign: 'center', marginBottom: 2, color: '#333333', fontSize: 14 }}>로그인 후 해당 서비스의 시간표까지</Text>
          <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 5, fontSize: 14 }}>이동하셔야 인식됩니다.</Text>
          <LightBoxButton onPress={this.onPressButton} style={styles.modalButton}>
            네, 확인했습니다
          </LightBoxButton>
        </View>
      </View>
    );
  }
}
