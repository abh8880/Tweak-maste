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

import { Actions } from 'react-native-router-flux';

import FlipCard from '../../../../custom_modules/react-native-flip-card';
// import FlipCard from 'react-native-flip-card';

import OriginDerivedWordCardFront from './OriginDerivedWordCardFront';
import ProgressCard from './ProgressCard';
import OriginWordCardBack from './OriginWordCardBack';
import DerivedWordCardBack from './DerivedWordCardBack';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: 'tweak-datax.db', createFromLocation: '~storage/tweak.db' });

export default class Word extends Component {

  constructor(props) {
    super(props)

    const { chapter, deck } = this.props;

    this.state = {
      flip: false,
      wordId: 0,
      // type: 'origin',    //  comment this and uncomment next line to see proper derived word card
      type: 'derived',
      originWord: 'Ethnos',
      // word: 'Ethnos',    //  comment this and uncomment next line to see proper derived word card
      word: 'Ethnicity',
      origin: 'Greek',
      // meaning: 'nation or race',   //  comment this and uncomment next line to see proper derived word card
      meaning: 'relating to a population subgroup (within a larger or dominant national or cultural group) with a common national or cultural tradition',
      tip: 'Relates to specific region/race/nationality',
      example: '“Television shows should reflect the ethnic diversity of the country.”',
      statusFlag: 1,
      status: 'Viewed',
      viewedFlag: 1,
      viewed: 10,
      currentlyLearning: 2,
      needRev: 3,
      mastered: 5,
      totalWords: 15,
      viewedProgress: 0,
      masteredProgress: 0,
      currentlyLearningProgress: 0,
      needRevProgress: 0,
      chapter: chapter,
      deck: deck,
      mode: -1,
      dummy : 'dummy',
    }


  }


  flipCard = () => {
    this.setState({ flip: !this.state.flip });
  }

  filterWord = (word) => {
    var indx = word.indexOf('(');
    if (indx == -1) {
      return (word);
    }
    else {
      return (word.substring(0, indx - 1));
    }
  }

  componentWillMount() {
    console.log('over here');
    console.log(this.state.chapter+" "+this.state.deck);
    this.initialDataFetch();
  }


  initialDataFetch() {
    //check if current table has entry of a word from the current deck
    console.log("inside fetch");
    db.transaction((tx) => {
      console.log("transac start");
      // this.setState({ word : "lol" });
      tx.executeSql('SELECT * FROM current WHERE chapter=? AND deck=?', [
          this.state.chapter,
          this.state.deck,
        ],
        (tx, result) => {
          if(result.rows.length>0) {                         //entry exists
            if(result.rows.item(0).mode == 1){
              console.log("entry exists");
              console.log("deck completed");
              //navigate to completed deck page
              Actions.deckComplete({
                chapter: this.state.chapter,
                deck: this.state.deck,
              });
            }
            else{
              console.log("entry exists");
              console.log("deck not completed");
              //so get word and its type and the current mode
              this.setState({
                mode: result.rows.item(0).mode,
                word: result.rows.item(0).word,
                type: result.rows.item(0).type,
              });
              console.log("current word = " + this.state.word);
              //get full details of the word
              if(this.state.type == 'origin') {     // if word type is origin get details of the origin word
                db.transaction((tx) => {
                  console.log("get details of the origin word");
                  tx.executeSql('SELECT * FROM origin WHERE origin_word=? AND chapter=? AND deck=? LIMIT 1', [
                    this.state.word,
                    this.state.chapter,
                    this.state.deck
                  ],
                  (tx, selectResult) => {
                    console.log("select for origindata done");
                    this.setState({
                      word: selectResult.rows.item(0).origin_word,
                      origin: selectResult.rows.item(0).origin,
                      meaning: selectResult.rows.item(0).meaning,
                      tip: selectResult.rows.item(0).tip,
                    })
                    console.log("set state for origindata done");
                    // get and set data for progress card
                    this.getNsetDataforProgressCard();
                  },function(error){
                    console.log("select error = "+error);
                  });
                });
              }
              else{                         // if word type is derived get details of the derived word
                db.transaction((tx) => {
                  console.log("get details of the derived word");
                  tx.executeSql('SELECT * FROM derived WHERE derived_word = ? AND chapter=? AND deck=? LIMIT 1', [
                    this.state.word,
                    this.state.chapter,
                    this.state.deck
                  ],
                  (tx, selectResult) => {
                    console.log("select for derived data done");
                    this.setState({
                      wordId: selectResult.rows.item(0).id,
                      word: selectResult.rows.item(0).derived_word,
                      originWord: selectResult.rows.item(0).origin_w,
                      meaning: selectResult.rows.item(0).meaning,
                      example: selectResult.rows.item(0).example,
                      viewedFlag: selectResult.rows.item(0).viewed,
                      statusFlag: selectResult.rows.item(0).status,
                    });
                    console.log("set state for derived data done");
                    this.setStatusFromFetchedData();
                    // get and set data for progress card
                    this.getNsetDataforProgressCard();
                  });
                });
              }
            }
          }
          else{                               //entry doesn't exist so get the first origin word of the deck
            db.transaction((tx) => {
              console.log("entry doesn't exist so get the first origin word of the deck");
              tx.executeSql('SELECT * FROM origin WHERE chapter=? AND deck =? LIMIT 1',[
                this.state.chapter,
                this.state.deck
              ],
              (tx, selectResult) => {
                console.log("select first origin word success");
                this.setState({
                  wordId: selectResult.rows.item(0).id,
                  word: selectResult.rows.item(0).origin_word,
                  type: 'origin',
                  origin: selectResult.rows.item(0).origin,
                  meaning: selectResult.rows.item(0).meaning,
                  tip: selectResult.rows.item(0).tip,
                })
                //update current table
                db.transaction((tx) => {
                  tx.executeSql('INSERT INTO current (word,type,chapter,deck) VALUES (?,?,?,?)', [
                    selectResult.rows.item(0).origin_word,
                    'origin',
                    this.state.chapter,
                    this.state.deck,
                  ],
                    (tx, insertResult) => {
                      console.log("successfull insert");
                    });
                });
                // get and set data for progress card
                this.getNsetDataforProgressCard();
              });
            });
          }
      });
    });
  }

  setStatusFromFetchedData = () => {
    console.log('inside set status');
    var status = this.state.statusFlag;
    if (status == 0 && this.state.viewedFlag == 1) {
      this.setState({ status: 'Viewed' });
      console.log("status set according to status flag");
    }
    else if (status == 1) {
      this.setState({ status: 'Mastered' });
      console.log("status set according to status flag");
    }
    else if (status == 2) {
      this.setState({ status: 'Currently Learning' });
      console.log("status set according to status flag");
    }
    else if (status == 3) {
      this.setState({ status: 'Need Review' });
      console.log("status set according to status flag");
    }
    else {
      this.setState({ status: 'Not Viewed' });
      console.log("status set according to status flag");
    }
  }


  seeDerivedWords = () => {
    console.log('in seeDerivedWords function');
    db.transaction((tx) => {
      //change database value of viewed to 1
      tx.executeSql('UPDATE origin SET viewed=1 WHERE chapter=? AND deck=? AND origin_word=?', [
        this.state.chapter,
        this.state.deck,
        this.state.word,
      ],
        (tx, updateResult) => {
        });
    });
    //get the first derived word
    db.transaction((tx) => {
      tx.executeSql('SELECT derived_word FROM derived WHERE chapter=? AND deck=? AND origin_w=? LIMIT 1', [
        this.state.chapter,
        this.state.deck,
        this.state.word,
      ],
        (tx, selectResult) => {
          let word = selectResult.rows.item(0).derived_word;
          //update current table
          db.transaction((tx) => {
            tx.executeSql('UPDATE current SET word=?,type=? WHERE chapter=? AND deck=?', [
              word,
              'derived',
              this.state.chapter,
              this.state.deck,
            ],
              (tx, updateResult) => {
                this.initialDataFetch();
                this.flipCard();
              });
          });
        });
    });
  }


  getNsetDataforProgressCard(){
    console.log("progress card data fetch function entered");
    db.transaction((tx) => {
      console.log("to get totalwords");
      tx.executeSql('SELECT COUNT(*) as noOfTotalWords FROM derived WHERE chapter=? AND deck=?', [
        this.state.chapter,
        this.state.deck
      ],
      (tx, selectResult) => {
        console.log("got totalwords");
        this.setState({totalWords: selectResult.rows.item(0).noOfTotalWords});
        console.log("totalwords"+this.state.totalWords);
      });
    });
    db.transaction((tx) => {
      console.log("to get viewed words");
      tx.executeSql('SELECT COUNT(*) as noOfViewed FROM derived WHERE viewed=1 AND chapter=? AND deck=?', [
        this.state.chapter,
        this.state.deck
      ],
      (tx, selectResult) => {
        console.log("got viewed words");
        this.setState({viewed: selectResult.rows.item(0).noOfViewed});
        console.log("viewed = " + this.state.viewed);
        this.setState({ viewedProgress: Math.floor((this.state.viewed / this.state.totalWords) * 100) / 100 });
        console.log("viewed progress = " + this.state.viewedProgress);
      });
    });
    db.transaction((tx) => {
      console.log("to get mastered words");
      tx.executeSql('SELECT COUNT(*) as noOfMastered FROM derived WHERE status=1 AND chapter=? AND deck=?', [
        this.state.chapter,
        this.state.deck
      ],
      (tx, selectResult) => {
        console.log("got mastered words");
        this.setState({mastered: selectResult.rows.item(0).noOfMastered});
        console.log("mastered = " + this.state.mastered);
        this.setState({ masteredProgress: Math.floor((this.state.mastered / this.state.totalWords) * 100) / 100});
        console.log("mastered progress= " + this.state.masteredProgress);
      });
    });
    db.transaction((tx) => {
      console.log("to get currently learning words");
      tx.executeSql('SELECT COUNT(*) as noOfCurrentlyLearning FROM derived WHERE status=2 AND chapter=? AND deck=?', [
        this.state.chapter,
        this.state.deck
      ],
      (tx, selectResult) => {
        console.log("got currently learning words");
        this.setState({currentlyLearning: selectResult.rows.item(0).noOfCurrentlyLearning});
        console.log("currentlyLearning = " + this.state.currentlyLearning);
        this.setState({ currentlyLearningProgress: Math.floor((this.state.currentlyLearning / this.state.totalWords) * 100) / 100});
        console.log("currentlyLearning progress = " + this.state.currentlyLearningProgress);
      });
    });
    db.transaction((tx) => {
      console.log("to get need review words");
      tx.executeSql('SELECT COUNT(*) as noOfNeedReview FROM derived WHERE status=3 AND chapter=? AND deck=?', [
        this.state.chapter,
        this.state.deck
      ],
      (tx, selectResult) => {
        console.log("got need review words");
        this.setState({needRev: selectResult.rows.item(0).noOfNeedReview});
        console.log("need review = "+this.state.needRev);
        this.setState({ needRevProgress: Math.floor((this.state.needRev / this.state.totalWords) * 100) / 100});
        console.log("need review progress= " + this.state.needRevProgress);
      });
    });
  }

  seeMeaningForDerivedWord = () => {
    if (this.state.viewedFlag != 1) {
      // update the value of viewed in the table where word = current word
      db.transaction((tx) => {
        //change database value of viewed to 1
        tx.executeSql('UPDATE derived SET viewed=1 WHERE chapter=? AND deck=? AND derived_word=?', [
          this.state.chapter,
          this.state.deck,
          this.state.word,
        ],
          (tx, updateResult) => {
            // this.setState({
            //   viewed: this.state.viewed + 1,              //increment viewed count in state
            //   viewedFlag: 1,                              //set viewedFlag to one
            //   status: 'Viewed'                            //set status to viewed in state
            // });
            this.initialDataFetch();
            this.flipCard();
          });
      });
    }
    else {
      // call initial data fetch and then flip the card
      this.initialDataFetch();
      this.flipCard();
    }
  }

  changeStatusAndFetchNext = (newStatus) => {
    console.log("new status = "+newStatus);
    if(newStatus == 'Mastered') {
      if(this.state.status == 'Viewed' || this.state.status == 'Currently Learning'){
        console.log("update to mastered");
        //update new status to mastered
        db.transaction((tx) => {
          //change database value of status to 1 i.e. mastered
          tx.executeSql('UPDATE derived SET status=1 WHERE chapter=? AND deck=? AND derived_word=?', [
            this.state.chapter,
            this.state.deck,
            this.state.word,
          ],
            (tx, updateResult) => {
              console.log("update to mastered success");
            });
        });
      }
      else if(this.state.status == 'Need Review'){
        //update status to currrently learning
        console.log("update to currrently learning");
        db.transaction((tx) => {
          //change database value of status to 2 i.e. currently learning
          tx.executeSql('UPDATE derived SET status=2 WHERE chapter=? AND deck=? AND derived_word=?', [
            this.state.chapter,
            this.state.deck,
            this.state.word,
          ],
            (tx, updateResult) => {
              console.log("update to currently learning success");
            });
        });
      }
    }
    else {
      console.log("inside need review conditional statement");
      if(this.state.status == 'Need Review'){
        console.log("already need review no need to update");
        //no need to update
      }
      else {
        //update status to need review
        console.log("update to need review ");
        db.transaction((tx) => {
          //change database value of status to 3 i.e. need review
          tx.executeSql('UPDATE derived SET status=3 WHERE chapter=? AND deck=? AND derived_word=?', [
            this.state.chapter,
            this.state.deck,
            this.state.word,
          ],
            (tx, updateResult) => {
              console.log("update to need review success");
            });
        });
      }
    }

    //get next word and store it in current AND change mode if necessary
    if(this.state.mode == -1){
      //normal mode
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM derived WHERE chapter=? AND deck=? AND origin_w=? AND id>? LIMIT 1', [
          this.state.chapter,
          this.state.deck,
          this.state.originWord,
          this.state.wordId,
        ],
          (tx, selectResult) => {
            if(selectResult.rows.length > 0){      // another derived word of the same origin word is present
              let word = selectResult.rows.item(0).derived_word;
              //update current table
              db.transaction((tx) => {
                tx.executeSql('UPDATE current SET word=?,type=? WHERE chapter=? AND deck=?', [
                  word,
                  'derived',
                  this.state.chapter,
                  this.state.deck,
                ],
                  (tx, updateResult) => {
                    this.initialDataFetch();
                    this.flipCard();
                  });
              });
            }
            else{
              //check if next word is origin or word from next deck
              db.transaction((tx) => {
                tx.executeSql('SELECT * FROM derived WHERE chapter=? AND deck=? AND id>? LIMIT 1', [
                  this.state.chapter,
                  this.state.deck,
                  this.state.wordId
                ],
                  (tx, selectCheckResult) => {
                    if(selectCheckResult.rows.length > 0){
                      //update current table with next origin word
                      db.transaction((tx) => {
                        tx.executeSql('UPDATE current SET word=?,type=? WHERE chapter=? AND deck=?', [
                          selectCheckResult.rows.item(0).origin_w,
                          'origin',
                          this.state.chapter,
                          this.state.deck,
                        ],
                          (tx, updateResult) => {
                            this.initialDataFetch();
                            this.flipCard();
                          });
                      });
                    }
                    else{
                      //check if all are mastered
                      db.transaction((tx) => {
                        tx.executeSql('SELECT COUNT(*) as noOfMastered FROM derived WHERE status=1 AND chapter=? AND deck=?', [
                          this.state.chapter,
                          this.state.deck
                        ],
                        (tx, selectMasteredResult) => {
                          if(selectMasteredResult.rows.item(0).noOfMastered == this.state.totalWords){
                            //update current table mode to 1
                            db.transaction((tx) => {
                              tx.executeSql('UPDATE current SET mode=1 WHERE chapter=? AND deck=?', [
                                this.state.chapter,
                                this.state.deck,
                              ],
                                (tx, updateResult) => {
                                  //navigate to completed deck page
                                  Actions.deckComplete({
                                    chapter: this.state.chapter,
                                    deck: this.state.deck,
                                  });
                                });
                            });

                          }
                          else{
                            //select word with max status where status > 1
                            db.transaction((tx) => {
                              tx.executeSql('SELECT derived_word FROM derived WHERE status=(SELECT MAX(status) FROM derived WHERE chapter=? AND deck=? AND status>1) AND chapter=? AND deck=? LIMIT 1', [
                                this.state.chapter,
                                this.state.deck,
                                this.state.chapter,
                                this.state.deck
                              ],
                              (tx, selectReShowResult) => {
                                //update current table with word to be reshown and update mode to reshow i.e 0
                                db.transaction((tx) => {
                                  tx.executeSql('UPDATE current SET word=?,type=?,mode=0 WHERE chapter=? AND deck=?', [
                                    selectReShowResult.rows.item(0).derived_word,
                                    'derived',
                                    this.state.chapter,
                                    this.state.deck
                                  ],
                                    (tx, updateResult) => {
                                      this.initialDataFetch();
                                      this.flipCard();
                                    });
                                });
                              });
                            });
                          }
                        });
                      });
                    }
                  });
              });
            }

          });
      });
    }
    else if(this.state.mode == 0){
      //reshow mode

      //check if all are mastered
      db.transaction((tx) => {
        tx.executeSql('SELECT COUNT(*) as noOfMastered FROM derived WHERE status=1 AND chapter=? AND deck=?', [,
          this.state.chapter,
          this.state.deck
        ],
        (tx, selectMasteredResult) => {
          if (selectMasteredResult.rows.item(0).noOfMastered == this.state.totalWords) {
            //if yes
            //update current table mode to 1
            db.transaction((tx) => {
              tx.executeSql('UPDATE current SET mode=1 WHERE chapter=? AND deck=?', [
                this.state.chapter,
                this.state.deck,
              ],
                (tx, updateResult) => {
                  //navigate to deck mastered page
                  Actions.deckComplete({
                    chapter: this.state.chapter,
                    deck: this.state.deck,
                  });
                });
            });
          }
          else{
            //if no
            //select word with max status where status > 1 and id> current id
            db.transaction((tx) => {
              tx.executeSql('SELECT derived_word FROM derived WHERE id>? AND chapter=? AND deck=? AND status=(SELECT MAX(status) FROM derived WHERE id>? AND chapter=? AND deck=? AND status>1) LIMIT 1', [
                this.state.wordId,
                this.state.chapter,
                this.state.deck,
                this.state.wordId,
                this.state.chapter,
                this.state.deck
              ],
              (tx, selectReShowResult) => {
                if(selectReShowResult.rows.length > 0){
                  //if word found
                  //update current table with word to be reshown
                  db.transaction((tx) => {
                    tx.executeSql('UPDATE current SET word=?,type=? WHERE chapter=? AND deck=?', [
                      selectReShowResult.rows.item(0).derived_word,
                      'derived',
                      this.state.chapter,
                      this.state.deck
                    ],
                      (tx, updateResult) => {
                        this.initialDataFetch();
                        this.flipCard();
                      });
                  });
                }
                else{
                  //if word not found
                  //select word with max status where status > 1
                  db.transaction((tx) => {
                    tx.executeSql('SELECT derived_word FROM derived WHERE chapter=? AND deck=? AND status=(SELECT MAX(status) FROM derived WHERE chapter=? AND deck=?) LIMIT 1', [
                      this.state.chapter,
                      this.state.deck,
                      this.state.chapter,
                      this.state.deck
                    ],
                    (tx, selectReShowNewResult) => {
                      //update current table with word to be reshown and update mode to reshow i.e 0
                      db.transaction((tx) => {
                        tx.executeSql('UPDATE current SET word=?,type=? WHERE chapter=? AND deck=?', [
                          selectReShowNewResult.rows.item(0).derived_word,
                          'derived',
                          this.state.chapter,
                          this.state.deck
                        ],
                          (tx, updateResult) => {
                            this.initialDataFetch();
                            this.flipCard();
                          });
                      });

                    });
                  });

                }

              });
            });

          }

        });
      });
    }
  }


  renderFront = () => {
    return(
      <OriginDerivedWordCardFront state={this.state} filterWord={this.filterWord} flipCard={this.flipCard} seeMeaningForDerivedWord={this.seeMeaningForDerivedWord}/>
    )
  }

  chooseToShowProgress = () => {
    if(!this.state.flip){
      return(
        <ProgressCard state={this.state}/>
      );
    }
    else {
      //do nothing
    }
  }

  renderBack = () => {
    if(this.state.type == 'origin'){
      return(
        <OriginWordCardBack state={this.state} filterWord={this.filterWord} seeDerivedWords={this.seeDerivedWords}/>
      );
    }
    else{
      return(
        <DerivedWordCardBack state={this.state} filterWord={this.filterWord} changeStatusAndFetchNext={this.changeStatusAndFetchNext}/>
      );
    }
  }

  render() {
    return (
      <View style={styles.flipCardContainer}>
      {/*<Text>{this.state.dummy}</Text>*/}
        <FlipCard
          flip={this.state.flip}
          friction={8}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
          clickable={false}
          // alignWidth={true}
          onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd) }}
        >

          {/* Face Side */}
          {this.renderFront()}

          {/* Back Side */}
          {this.renderBack()}

        </FlipCard>
        {this.chooseToShowProgress()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flipCardContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#103970'
  },
});
