/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {

  StyleSheet,
  Text,
  View
} from 'react-native';



import { StatusBar } from 'react-native';

export default class Speaking extends Component<{}> {
  render() {
    return (
      StatusBar.setHidden(true),
      <View style={styles.container}>
        <Text style={styles.welcome}>
         Speaking Skills
        </Text>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});