//import SplashScreen from 'react-native-splash-screen'

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text
} from 'react-native';

import Routes from './src/Routes';

export default class App extends Component<{}> {

   /*componentDidMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }*/
  constructor(){
    super();
    Text.defaultProps.allowFontScaling=false;
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="#1c313a"
           barStyle="light-content"
         />
        <Routes/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  }
});
