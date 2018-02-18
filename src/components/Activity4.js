import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';

import * as Progress from 'react-native-progress';

var words = [];
var len = 0;
var i;

var topic;
var chapter;
var status;
var time;
var timeout;
var timer = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
export default class Activity4 extends Component {

  constructor(props) {
  time = new Array();
  super(props);

  this.state = {
    question: '',
    words: words,
    len:len,
    check_ans: 0,
    status: 0,
    id:0,
    last:0,
    repeat:0,
    rem_rep:0,
    time:time,
    progress:1
  };

  var rand = Math.floor(Math.random()*3)+1;
  topic = this.props.topic;
  chapter = this.props.chapter;
  console.log("recieved "+topic+chapter);
  
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM act4 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var length = results.rows.length;

       console.log("DB:"+length);

       if(length > 0){
        var rand = Math.floor(Math.random()*(length-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({question: row.question});
        console.log(this.state.question);
        words = row.question.split(" ");
        console.log(this.state.words);
        this.setState({words:words});
        len = words.length;
        this.setState({len:len});

        if(len==1 && this.props.wrong == 0)
          this.setState({last:4});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:4})
       }
          
        });
    });
}


_handleSubmitPress = () => {
  console.log(this.state.current_ans);
  console.log(this.state.correct_ans);

  if(this.state.current_ans === this.state.correct_ans){
    console.log("entered");        

    this.setState({check_ans: 1});
    this.setState({repeat: 0});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act4 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
  }

  else{
    this.setState({check_ans: 0});
    this.setState({repeat: 4});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act4 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });        
  }

  console.log(this.state.check_ans);
  this.setState({status: 1});
        
};

update2 = () =>{
    db.transaction((tx) => {
    tx.executeSql('UPDATE act4 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
    });
  
  });
  };
  render() {

    if(topic == -1){
      clearTimeout(timeout);

      timeout = setTimeout((function() {
        this.setState({ progress: this.state.progress - 0.1});
      }).bind(this), 1000);
  
      console.log("progress="+this.state.progress);
  
      if(this.state.progress<0){
        console.log("less");
        clearTimeout(timeout);
        this.update2();
        return(
          <Time_up topic={topic} chapter={chapter} end={this.state.last}/> 
        );
      }
  
    }

if (topic == -1) 
    {
      timer = <View >
              <Progress.Bar progress={this.state.progress} width={Dimensions.get('window').width} height={8} color={'rgba(255, 255, 255, 1)'}/>

          </View>;
    }

    console.log(this.state.words);

    var element = [];

    for( i=0 ; i<len; i++){

  console.log(i);      
        if(words[i]=='_'){
            element.push(
              <TextInput
                style={{ width: 100, height: 44, padding: 8, textAlign: 'center', fontSize:20, fontFamily: 'Museo Sans Rounded_500',}}
              />
            );
        }
        
        else{
          element.push(
              <Text style={{fontSize:20, fontFamily: 'Museo Sans Rounded_500',}}>{words[i]+" "}</Text>
          );
        }

    }

    len = 0;
    
    if(this.state.status == 0){
      return (

      <View style={styles.container}>
       
       {topic==-1 && timer}
            <View style={styles.questBox}>
              {element}
            </View>
  
            <View style={styles.subBox}>
                      <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                        <View style={styles.button}>
                     <Text style={{fontSize:20, fontFamily: 'Museo 500',color:'#ffffff'}}>SUBMIT</Text>
                        </View>
                      </TouchableOpacity>
              </View>
          
        </View>
      );
    }

    else if(this.state.status == 1){
      clearTimeout(timeout);
      console.log("rep_state="+this.state.repeat);
        console.log("rem_rep_state="+this.state.rem_rep);
        return(
          <Result score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  timer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 20,
    alignSelf: 'flex-start'
  },
  questBox: {
    flex: 2,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#9FA8DA',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  
  subBox: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
  },
  
  button: {
    margin: 30,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    borderRadius: 50
  },

});
