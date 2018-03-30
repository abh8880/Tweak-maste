/**
  * Author : Jaffrey Joy
  * Copyright (c) 2018 All Rights Reserved
**/

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: 'tweak-datax.db', createFromLocation: '~storage/tweak.db' });

import ChapterCard from './ChapterCard';

// var imgsrc = '../../../icons/' + i.toString() + '.png';

var chapterIconSources = [
  require('../../../icons/vocabChapterIcons/1.png'),
  require('../../../icons/vocabChapterIcons/2.png'),
  require('../../../icons/vocabChapterIcons/3.png'),
  require('../../../icons/vocabChapterIcons/4.png'),
  require('../../../icons/vocabChapterIcons/5.png'),
  require('../../../icons/vocabChapterIcons/6.png'),
  require('../../../icons/vocabChapterIcons/7.png'),
  require('../../../icons/vocabChapterIcons/8.png'),
  require('../../../icons/vocabChapterIcons/9.png')
]

export default class Chapter extends Component {
  constructor(props){
    super(props)

    this.state={
      cardsListComponent : <View></View>,
    }
  }

  generateChapterCards = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT COUNT(DISTINCT chapter) AS noOfChapters FROM origin', [], (tx, countResult) => {
        var noOfChapters = countResult.rows.item(0).noOfChapters;
        console.log("no of chapters = " + noOfChapters);
        var cardsList = []
        for (let i = 0; i < noOfChapters; i++) {
          cardsList.push(
            <ChapterCard  chapterNo={i + 1} image={chapterIconSources[i]} />
          )
        }
        this.setState({cardsListComponent : cardsList});
        return (0);
      })
    });
  }

  componentDidMount(){
    this.generateChapterCards();
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {this.state.cardsListComponent}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#ffffff',
  },
  container:{
    flex:1,
    paddingTop: '5%',
    paddingBottom: '5%',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }
});
