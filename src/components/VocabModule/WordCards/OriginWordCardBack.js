/**
  * Author : Jaffrey Joy
  * Copyright (c) 2018 All Rights Reserved
**/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const width = Dimensions.get('window').width;

import Tts from 'react-native-tts';

export default class OriginWordCardBack extends Component {

  constructor(props) {
    super(props)
    this.state = this.props.state;
  }

  render() {
    return (
      <View style={styles.back}>
        <View style={styles.backMainWordStyle}>
          <Text style={styles.backMainWordText}>{this.props.state.word}</Text>
          <TouchableOpacity onPress={() => { Tts.speak(this.props.state.word); }}>
            <Text style={styles.backMainWordSpeechIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backElements}>
          <Text style={styles.backMainText}>Origin : </Text>
          <Text style={styles.backSubText}>{this.props.state.origin}</Text>
        </View>
        <View style={styles.backElements}>
          <Text style={styles.backMainText}>Meaning : </Text>
          <Text style={styles.backSubText}>{this.props.state.meaning}</Text>
        </View>
        <View style={styles.backElements}>
          <Text style={styles.backMainText}>Tip : </Text>
          <Text style={styles.backSubText}>{this.props.state.tip}</Text>
        </View>
        <TouchableOpacity
          onPress={() => { this.props.seeDerivedWords() } }
        >
          <View style={styles.backOriginButton}>
              <Text style={styles.backOriginButtonText}>Click to see derived words ➜</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  back: {
    width: width - width/10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backMainWordStyle:{
    width: width - width/10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#021f4f',
    borderBottomWidth: 1,
    // marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  backMainWordText:{
    margin: 10,
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 30,
    color: '#001b54',
  },
  backMainWordSpeechIcon:{
    marginLeft: 5,
    fontSize: 22,
    color: '#rgba(255, 255, 255, 0)',
    textShadowColor: 'rgba(0, 20, 64, 0.86)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 1,
  },
  backElements : {
    flexDirection : 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    margin: 8,
    marginLeft: 18,
    marginRight: 18,
  },
  backMainText:{
    fontFamily: 'Museo 500',
    fontSize: 22,
    color: '#001b54',
  },
  backSubText:{
    fontFamily: 'Museo Sans Rounded_300',
    fontSize: 22,
    color: '#00226a',
  },
  backOriginButton: {
    width: width - width/10,
    height: 50,
    marginTop: 30,
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#021f4f',
    backgroundColor: '#cadcf1',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  backOriginButtonText: {
    color: '#021f4f',
    textAlign: 'center',
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 22,
  },
});
