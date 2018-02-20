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

export default class OriginDerivedWordCardFront extends Component {

  constructor(props) {
    super(props)
    // this.state = this.props.state;
  }

  decideNextState(){
    console.log("inside decision function");
    if (this.props.state.type == 'origin')
      this.props.flipCard();
    else
      this.props.seeMeaningForDerivedWord();
  }



  render() {
    return (
      <View style={styles.front}>
        <View>
          <Text style={styles.frontWord}>{this.props.state.word}</Text>
          <Text style={styles.type}>({this.props.state.type})</Text>
        </View>
      <TouchableOpacity onPress={() => { this.decideNextState() }}>
        <View style={styles.frontButton}>
            <Text style={styles.frontButtonText}>Click to see meaning  ➜</Text>
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  front: {
    width: width - width/10,
    borderRadius:10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontWord:{
    marginTop: 50,
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 37,
    color: '#001b54',
  },
  type:{
    marginBottom: 50,
    fontFamily: 'Museo Sans Rounded_300',
    alignSelf: 'center',
    fontSize: 25,
    color: '#5585ec',
  },
  frontButton: {
    width: width - width/10,
    height: 50,
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#021f4f',
    backgroundColor: '#cadcf1',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  frontButtonText: {
    color: '#021f4f',
    textAlign: 'center',
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 22,
  },
});
