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

import { Actions } from 'react-native-router-flux';

const width = Dimensions.get('window').width;

export default class ChapterCard extends Component {
  constructor(props){
    super(props);
  }

  navigateToDeckPage = (chapter) => {
    Actions.deck({
      unit: this.props.data.unit,
      chapter: chapter
    });
  }

  render() {
    return (
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Chapters</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.cardElements} onPress={() => {this.navigateToDeckPage(1)}}>
            <Text style={styles.cardElementText}>Chapter</Text>
            <Text style={styles.cardElementText}>1</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardElementsTwoParent}>
            <TouchableOpacity style={styles.cardElementsTwo} onPress={() => {this.navigateToDeckPage(2)}}>
              <Text style={styles.cardElementText}>Chapter</Text>
              <Text style={styles.cardElementText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardElementsTwo} onPress={() => {this.navigateToDeckPage(3)}}>
              <Text style={styles.cardElementText}>Chapter</Text>
              <Text style={styles.cardElementText}>3</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardBody:{
    alignItems: 'center',
    width: width - width/8,
    flex: 1,
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderBottomColor: '#003665',
    borderBottomWidth: 3,
    elevation: 13
  },
  cardHeader:{
    width: width - width/8,
    padding:15,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#003665',
    borderBottomWidth: 1.5,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    elevation: 4
  },
  cardHeaderText:{
    alignItems: 'center',
    fontFamily: 'Museo 700',
    fontSize: 25,
    color: '#06337c',
  },
  cardContent:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  cardElements:{
    justifyContent: 'center',
    alignItems: 'center',
    width: 105,
    height: 105,
    borderRadius: 100,
    borderColor: '#002040',
    backgroundColor: '#dee9ff',
    borderWidth: 2,
    marginTop: 30,
    elevation: 15,

  },
  cardElementText:{
    alignItems: 'center',
    fontFamily: 'Museo Sans_500',
    fontSize: 18,
    color: '#001b37',
    padding: 5
  },
  cardElementsTwo:{
    justifyContent: 'center',
    alignItems: 'center',
    width: 105,
    height: 105,
    borderRadius: 100,
    borderColor: '#002040',
    backgroundColor: '#dee9ff',
    borderWidth: 2,
    margin: 20,
    marginBottom: 40,
    elevation: 15,
  },
  cardElementsTwoParent:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
