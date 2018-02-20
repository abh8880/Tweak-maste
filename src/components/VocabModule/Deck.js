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
  TouchableOpacity,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import EZSwiper from '../../../custom_modules/react-native-ezswiper';
// import EZSwiper from 'react-native-ezswiper';

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;

var origindata = [{ key: '1', word: 'lol' }, { key: '2', word: 'gtg' }, { key: '3', word: 'ppl' }]

var currentDeck = 0;

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: 'tweak-datax.db', createFromLocation: '~storage/tweak.db' });

export default class Deck extends Component {

  constructor(props) {
    super(props)
    const {unit ,chapter} = this.props;
    this.state = {
      unit: unit,
      chapter: chapter,
      // noOfCards: ['', '', ''],
      noOfDecks: [''],
      origindata: [
        [{ key: 1, word: 'lol' }],
        [{ key: 2, word: 'lol' }],
        [{ key: 3, word: 'lol' }]
        [{ key: 4, word: 'lol' }]
      ]
    }
    // alert(unit+" "+chapter);

  }

  componentWillMount() {
    //get no of decks from the current chapter
    var noOfDecks;
    db.transaction((tx) => {
      tx.executeSql('SELECT COUNT(DISTINCT deck) AS noOfDecks FROM origin WHERE unit=? AND chapter=?', [this.state.unit,this.state.chapter], (tx, countResult) => {

        noOfDecks = countResult.rows.item(0).noOfDecks;
        console.log("no of decks = " + noOfDecks);

        tempDecks = []
        for (var k = 0; k < noOfDecks; k++) {
          tempDecks.push(k);
        }

        var tempArray = [];
        var parentDataArray = [];
        // console.log('no of decks in insertorigin = ' + tempDecks.length);

        // var promises = [];

        tempDecks.forEach(i => {
        // for (var i = 0; i < noOfDecks ; i++) {

          console.log('i = ' + i);
          // console.log('tempdecks = ' + tempDecks);
          var childDataArray = [];

          console.log('over here mate');
          db.transaction((tx) => {
            console.log('inside transac');
            tx.executeSql('SELECT origin_word FROM origin WHERE unit=? AND chapter=? AND deck=?', [this.state.unit, this.state.chapter, i + 1], (tx,selectResult) => {

              console.log("inside callback " + i);
              tempArray.push('x');
              // this.setState({ noOfDecks: tempArray });
              console.log('originwords select resultlength = ' + selectResult.rows.length);
              console.log('childArray = ' + childDataArray);

              for (var j = 0; j < selectResult.rows.length; j++) {
                console.log("originword push "+j);
                console.log('child push');
                childDataArray.push({
                  key: j,
                  word: selectResult.rows.item(j).origin_word,
                });
                console.log('after push childArray = ' + childDataArray);
              }

              console.log('set parent');
              parentDataArray.push(childDataArray);
              console.log('parent = ' + JSON.stringify(parentDataArray[i][0]));
              this.setState({ noOfDecks: tempArray, origindata: parentDataArray });
              console.log("no of decks state = " + this.state.noOfDecks);
              console.log('origindata = ' + this.state.origindata);
              console.log('origindata data = ' + JSON.stringify(this.state.origindata[i][0]));

              childDataArray = [];

            })
            console.log('finished one db transaction')
          })

          console.log('for end');
        })
      });
    });

  }


  //set 'x' no of decks for ezswiper to generate 'x' no of cards
  setNoOfDecks(noOfDecks){
    console.log('no of decks'+noOfDecks);
    tempArray =[];
    for (var i = 0; i < noOfDecks; i++) {
      console.log(i+' add deck');
      tempArray.push(' ');
    }
    this.setState({noOfDecks:tempArray});
    console.log('temparray '+tempArray.toString());
    console.log('no of decks in state '+this.state.noOfDecks.toString());
  }

  //return origin words in a deck as a component
  renderOriginw(index) {
    console.log("renderOgWord origindata = " + this.state.origindata[index])
    allWords = []
    for (i in this.state.origindata[index]){
      var { key , word } = this.state.origindata[index][i]
      allWords.push(<Text key={key} style={styles.originList}>{word}</Text>);
    }
    return(allWords);

    // return this.state.origindata[index].map(ogdata => (
    //   <Text key={ogdata.key} style={styles.originList}>{ogdata.word}</Text>
    // ));

    // return origindata.map(ogdata => (
    //     <Text key={ogdata.key} style={styles.originList}>{ogdata.word}</Text>
    //   ));
  }

  // return single deck card components with data
  renderRow = (obj, index) => {

    console.log("inside renderRow");

    var comp;
    var finalcomp;
    originWordsList = this.renderOriginw(index);

    finalcomp =
      <View style={[styles.deckCard, { backgroundColor: "#ffffff", borderRadius: 15, position: 'relative' }]}>
        <Text style={styles.deckTitle}>Deck {index+1}</Text>
        <Text style={styles.deckSubTitle}>Origin Words:</Text>
        <View>
          {originWordsList}
        </View>
        <View style={styles.deckButtonView}>
        <TouchableOpacity style={styles.deckButton} onPress={this.onPressDeckButton}>
            <Text style={styles.deckButtonText}>PRACTISE 📝</Text>
          </TouchableOpacity>
        </View>
      </View>

    return (finalcomp)
  }

  onPressDeckButton = () => {
    // alert('Practise Deck '+currentDeck);
    db.transaction((tx) => {
      console.log("inside check for deck complete in deck page");
      // this.setState({ word : "lol" });
      tx.executeSql('SELECT * FROM current WHERE unit=? AND chapter=? AND deck=?', [
        this.state.unit,
        this.state.chapter,
        currentDeck+1,
      ],
        (tx, result) => {
          console.log("successfully executed select for current in deck page")
          if (result.rows.length > 0) {                         //entry exists
            if (result.rows.item(0).mode == 1) {
              console.log("entry exists in deck page");
              console.log("deck completed in deck page");
              //navigate to completed deck page
              Actions.deckComplete({
                unit: this.state.unit,
                chapter: this.state.chapter,
                deck: currentDeck + 1,
              });
            }
            else{
              Actions.word({
                unit: this.state.unit,
                chapter: this.state.chapter,
                deck: currentDeck + 1,
              });
            }
          }
          else{
            Actions.word({
              unit: this.state.unit,
              chapter: this.state.chapter,
              deck: currentDeck + 1,
            });
          }
      });
    });
  }

  onDidChange = (obj, index) => {
    console.log('onDidChange=>obj:' + obj + ' ,index:' + index);
    currentDeck = index;
  }


  render() {
    return (
      <View style={styles.container}>
        <EZSwiper style={[styles.swiper, { width: width, height: height/2 }]}
          dataSource={this.state.noOfDecks}
          width={width}
          height={height/2}
          renderRow={this.renderRow}
          onDidChange={this.onDidChange}
          ratio={0.7}
          index={0}
          horizontal={true}
          loop={false} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a8fe7'
  },
  swiper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a8fe7',
  },
  deckCard: {
    flex: 1,
    alignItems: 'center',
    borderBottomColor: '#003665',
    borderBottomWidth: 3,
  },
  deckTitle:{
    fontFamily: 'Museo 700',
    fontSize: 35,
    margin: 25,
    color: '#00336c'
  },
  deckSubTitle:{
    fontFamily: 'Museo Sans_500',
    fontSize: 25,
    color: '#00336c',
    marginBottom: 5,
  },
  originList:{
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 20,
    margin: 3,
    color: '#000000',
    alignSelf: 'center'
  },
  deckButtonView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    elevation: 20
  },
  deckButton:{
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 25,
    backgroundColor: '#2a8fe7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 3,
  },
  deckButtonText:{
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 18,
    color: '#ffffff',
  }
});
