import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity, Dimensions, TouchableHighlight } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { THEME } from '../config/theme';

const { width, height } = Dimensions.get('window');
const headerHeight = 120;
const buttonHeight = 55;
const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    height: headerHeight,
    flexDirection: 'row',
    paddingTop: 22,
    paddingLeft: 22,
    paddingRight: 22,
  },
  headerText: {
    fontSize: 36,
    fontWeight: '300',
  },
  headerTextStore: {
    top: -7,
    fontSize: 36,
    fontWeight: '500',
  },
  closeIcon: {
    alignSelf: 'flex-start',
  },
  image: {
    width: width - 110,
    left: 55,
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
};

const Slide = props => {
  return (
    <View style={styles.slide}>
      <Image resizeMode='contain' onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={{uri: props.uri}} />
    </View>)
};

export default class ThemeStore extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // imgList: [
      //   'http://a3.mzstatic.com/eu/r30/Purple20/v4/78/52/35/78523507-6310-187a-5438-20a5cc80326a/screen696x696.jpeg',
      //   'http://a3.mzstatic.com/eu/r30/Purple20/v4/78/52/35/78523507-6310-187a-5438-20a5cc80326a/screen696x696.jpeg',
      // ],
      // loadQueue: [0, 0, 0, 0],
    };
    this.loadHandle = this.loadHandle.bind(this);
    this.onPressSetTheme = this.onPressSetTheme.bind(this);
  }

  loadHandle(i) {
    // const loadQueue = this.state.loadQueue;
    // loadQueue[i] = 1;
    // this.setState({ loadQueue });
  }

  onPressSetTheme() {
    this.props.onPressSetTheme(THEME[this.swiper.state.index].id);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>THEME</Text>
            <Text style={styles.headerTextStore}>STORE</Text>
          </View>
          <TouchableOpacity onPress={this.props.onPressCloseButton} style={{padding: 10, right: -10, top: -13}}>
            <Ionicon name={'ios-close'} color={'#333333'} size={50} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <View>
          <Swiper
            ref={ref => this.swiper = ref}
            prevButton={<Ionicon name={'ios-arrow-back'} color={'#333333'} size={30} style={{ left: 10 }} />}
            nextButton={<Ionicon name={'ios-arrow-forward'} color={'#333333'} size={30} style={{ right: 10 }} />}
            showsButtons
            showsPagination={false}
            loadMinimal
            loadMinimalSize={3}
            height={height - headerHeight - buttonHeight}
          >
            {
              THEME.map((item, i) => <Slide
                loadHandle={this.loadHandle}
                uri={item.thumbnail}
                i={i}
                key={i} />)
            }
          </Swiper>
        </View>
        <TouchableHighlight onPress={this.onPressSetTheme} style={{ height: buttonHeight, }}>
          <View style={{ height: buttonHeight, justifyContent: 'center', backgroundColor: '#333333'}}>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontSize: 17, }}>적용하기</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
