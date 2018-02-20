/**
  * Author : Jaffrey Joy
  * Copyright (c) 2018 All Rights Reserved
**/

import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Chapter from './Chapter';

var SQLite = require('react-native-sqlite-storage')
// var db = SQLite.openDatabase({ name: 'tweak.db', createFromLocation: '~storage/tweak.db'});
var db = SQLite.openDatabase({ name: 'tweak-datax.db', createFromLocation: '~storage/tweak.db' });
// var db = SQLite.openDatabase({ name: 'tweak-data.db',  location: 'default'});

export default class VocabHome extends Component {

  constructor(props) {
    super(props);

    // setTimeout(function(){
    //   console.log('delete here');
    //   SQLite.deleteDatabase({ name: 'tweak-datax.db', location: 'default' });
    // },2000);


    // db.transaction((tx) => {
    //   tx.executeSql('CREATE TABLE temp (id INTEGER,name TEXT)');
    // });
    // db.transaction((tx) => {
    //   tx.executeSql('INSERT INTO temp (id,name) VALUES (?,?)', [1,'lol'], (tx, res) => {
    //     // let noOfDecks = countResult.rows.item(0).noOfDecks;
    //     // console.log(noOfDecks);
    //     console.log(res.rowsAffected);
    //   });
    // });

    // db.transaction((tx) => {
    //   tx.executeSql('SELECT COUNT(DISTINCT deck) AS noOfDecks FROM origin WHERE unit=? AND chapter=?', [1,1], (tx, countResult) => {
    //     let noOfDecks = countResult.rows.item(0).noOfDecks;
    //     console.log(noOfDecks);
    //   });
    // });

    // db.transaction((tx) => {
    //   tx.executeSql('DELETE FROM current', [], (tx, deleteResult) => {
    //   });
    // });

    // db.transaction((tx) => {
    //   tx.executeSql('UPDATE origin SET viewed=0', [], (tx, updateResult) => {
    //   });
    // });

    // db.transaction((tx) => {
    //   tx.executeSql('UPDATE derived SET viewed=0,status=0', [], (tx, updateResult) => {
    //   });
    // });

    // db.transaction((tx) => {
    //   tx.executeSql('SELECT * FROM current WHERE unit=? AND chapter=? AND deck=?', [1,1,1], (tx, selectResult) => {
    //     // let countr = selectResult.rows.item(0).countr;
    //     if(selectResult.rows.length>0){
    //       let id = selectResult.rows.item(0).id;
    //       let word = selectResult.rows.item(0).word;
    //       let type = selectResult.rows.item(0).type;
    //       let unit = selectResult.rows.item(0).unit;
    //       let chapter = selectResult.rows.item(0).chapter;
    //       let deck = selectResult.rows.item(0).deck;
    //       let mode = selectResult.rows.item(0).mode;
    //       // console.log(countr);
    //       console.log(id);
    //       console.log(deck);
    //       console.log(word);
    //       console.log(type);
    //       console.log(unit);
    //       console.log(chapter);
    //       console.log(mode);
    //     }
    //     else{
    //       console.log('current table empty');
    //     }

    //   });
    // });

    // db.transaction((tx) => {
    //   tx.executeSql('SELECT name FROM sqlite_master WHERE type=?', ['table'], (tx, res) => {
    //     let table_name = res.rows.item(0).name;
    //     console.log(table_name);
    //   });
    // });

  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.chapterContainer}>
          <Chapter />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer:{
    flex:1,
    backgroundColor: '#2a8fe7',
  },
  chapterContainer:{
    alignItems: 'center',
  }
});