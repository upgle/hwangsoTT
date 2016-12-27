import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Alert
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

const ColoredTextfield = MKTextField.textfield()
  .withStyle({ height: 28, flex: 1 })
  .withTextInputStyle({flex: 1})
  .withHighlightColor('#7b4fea')
  .build();

export default class ImporterLoginWarning extends Component {

  constructor(props) {
    super(props);
    this.state = {
      permalink: '',
    };
    this.onPressDismiss = this.onPressDismiss.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
  }

  onPressButton() {
    if (this.state.permalink.length === 0) {
      Alert.alert('경고', '주소를 입력해주시기 바랍니다.');
      return;
    }
    if (!(new RegExp(this.props.regex)).test(this.state.permalink)) {
      Alert.alert('경고', '주소 형식이 올바르지 않습니다.');
      return;
    }
    this.props.navigator.handleDeepLink({ link: this.state.permalink });
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
          <Icon name="ios-link" color="#7b4fea" size={53} style={{ marginVertical: 12 }}/>
          <Text style={{ textAlign: 'center', marginBottom: 2, color: '#333333', fontSize: 14 }}>
            고유주소 기반으로 시간표를 가져옵니다
          </Text>
          <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 10, fontSize: 14 }}>
            아래의 형태의 주소를 입력해주세요.
          </Text>
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 }}>
            <ColoredTextfield
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(permalink) => this.setState({ permalink })}
              onFocus={() => {
                if (this.state.permalink.length === 0 && (this.props.onFocusDefault)) {
                  this.setState({ permalink: this.props.onFocusDefault });
                }
              }}
              value={this.state.permalink}
              placeholder={this.props.placeholder}
            />
          </View>
          <LightBoxButton onPress={this.onPressButton} style={styles.modalButton}>
            가져오기
          </LightBoxButton>
        </View>
      </View>
    );
  }
}
