import React, {Component} from 'react';
import { Alert, StatusBar, Modal, View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { MKTextField } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
});

const Button = React.createClass({
  getInitialState() {
    return {
      active: false,
    };
  },

  _onHighlight() {
    this.setState({active: true});
  },

  _onUnhighlight() {
    this.setState({active: false});
  },

  render() {
    var colorStyle = {
      color: this.state.active ? '#fff' : '#000',
    };
    return (
      <TouchableHighlight
        onHideUnderlay={this._onUnhighlight}
        onPress={this.props.onPress}
        onShowUnderlay={this._onHighlight}
        style={[styles.button, this.props.style]}
        underlayColor="#a9d9d4">
        <Text style={[styles.buttonText, colorStyle]}>{this.props.children}</Text>
      </TouchableHighlight>
    );
  }
});

const ColoredTextfield = MKTextField.textfield()
  .withStyle({ height: 28, flex: 1 })
  .withPlaceholder('http://snutt.kr/user/24179')
  .withHighlightColor('#7b4fea')
  .build();

const innerContainerTransparentStyle = { backgroundColor: '#fff', padding: 20 };

export class AuthGuideModal extends Component {
  render() {
    return (
      <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
        <Icon name="ios-pulse" color="#7b4fea" size={53} style={{marginVertical: 13}}/>
        <Text style={{ textAlign: 'center', marginBottom: 1, color: '#333333', fontSize: 15 }}>로그인 후 해당 서비스 시간표에</Text>
        <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 5, fontSize: 15 }}>접근하여 정보를 불러옵니다.</Text>
        <Text style={{ textAlign: 'center', color: '#666666', fontSize: 13, fontWeight: '100', marginBottom: 5 }}>(반드시 시간표 페이지로 이동하세요)</Text>

        <Button onPress={this.props.onPressButton} style={styles.modalButton}>
          네, 확인했습니다
        </Button>
      </View>
    );
  }
}

export class PermalinkGuideModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      permalink: '',
    };
  }
  render() {
    return (
      <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
        <Icon name="ios-link" color="#7b4fea" size={53} style={{ marginVertical: 12 }}/>
        <Text style={{ textAlign: 'center', marginBottom: 1, color: '#333333' }}>
          고유주소 기반으로 시간표를 가져옵니다
        </Text>
        <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 10 }}>
          아래의 형태의 주소를 입력해주세요.
        </Text>
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 }}>
          <ColoredTextfield
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onChangeText={(permalink) => this.setState({ permalink })}
            onFocus={() => { if (this.state.permalink.length == 0) this.setState({ permalink: 'http://snutt.kr/user/' }); }}
            value={this.state.permalink}
          />
        </View>
        <Button onPress={this.props.onPressButton} style={styles.modalButton}>
          가져오기
        </Button>
      </View>
    );
  }
}