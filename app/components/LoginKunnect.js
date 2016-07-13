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
import {
  setTheme,
  MKButton,
  MKColor,
  MKTextField,
  MKSpinner
} from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class LoginKunnect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: '',
      password: '',
    };
  }

  componentWillMount() {
    StatusBar.setHidden(true, 'none');
  }

  componentWillUnmount() {
    StatusBar.setHidden(false, 'none');
  }

  onClickLogin() {
    if(this.state.id.length === 0) {
        Alert.alert(
          '경고',
          '아이디를 입력해주시기 바랍니다.',
          [{text: '확인'}]
        );
        return;
    }
    if(this.state.password === 0) {
        Alert.alert(
          '경고',
          '비밀번호를 입력해주시기 바랍니다.',
          [{text: '확인'}]
        );
        return;
    }
    this.props.onClickLogin(this.state.id, this.state.password);
  }

  render() {

    var spinner;

    if(this.props.isLoading) {
      spinner = (<SingleColorSpinner />);
    }

    return (
      <View style={styles.container}>
        {spinner}
        <Image source={require('../resources/knt_login_logo.png')} />
        <Text style={styles.welcome}>
          건국대학교 학생 시간표 서비스
        </Text>
        <View style={styles.loginForm}>
          <View style={styles.field}>
            <Text>아이디</Text>
            <TextfieldID
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(text) => {
                this.setState({id : text});
              }}
            />
          </View>
          <View style={styles.field}>
            <Text>비밀번호</Text>
            <TextfieldPW
                password={true}
                onChangeText={(text) => {
                this.setState({password : text});
              }}
            />
          </View>
          <LoginButton onPress={this.onClickLogin.bind(this)} />
          <View style={styles.messageView}>
            <Text style={styles.messageText}>KUNNECT 회원이 아니시라면 먼저 <Text style={{color:'#666', fontWeight: 'bold'}}>가입</Text>을 해주시기 바랍니다.</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.5} style={{position: 'absolute', right: 25, top:25}} onPress={this.props.onClickClose}>
          <Icon name='close' size={35} color='#999' />
        </TouchableOpacity>
      </View>
    );
  }
}

setTheme({
  primaryColor: '#41bd00',
  primaryColorRGB: MKColor.RGBGreen,
  accentColor: MKColor.Amber,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  textfield: {
    width: 170,
    height: 40,
  },
  field: {
    marginBottom : 10
  },
  welcome: {
    fontSize: 13,
    textAlign: 'center',
    padding: 10,
    marginBottom: 10,
    color: '#666666'
  },
  loginForm: {
    height: 240,
  },
  textEdit: {
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
  },
  messageView: {
    width: 170,
    marginTop: 30,
  },
  messageText: {
    color:'#999999',
    fontSize: 13,
    textAlign: 'center',
  },
  spinner: {
    position: 'absolute',
    left: 30,
    top: 32,
    width: 22,
    height: 22,
  }
});

const TextfieldPW = MKTextField.textfield()
  .withPlaceholder('*****')
  .withStyle(styles.textfield)
  .build();

const TextfieldID = MKTextField.textfield()
  .withPlaceholder('ID')
  .withStyle(styles.textfield)
  .build();

const LoginButton = MKButton.coloredButton()
  .withText('시간표 가져오기')
  .build();


const SingleColorSpinner = MKSpinner.singleColorSpinner()
    .withStyle(styles.spinner)
    .build();