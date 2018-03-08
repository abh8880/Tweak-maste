import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text
} from 'react-native';

import Routes from './src/Routes';

export default class App extends Component<{}> {
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
