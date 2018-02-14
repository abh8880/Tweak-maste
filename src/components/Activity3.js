import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';

import * as Progress from 'react-native-progress';

var answer;
var ans;
var length=0;
var pressed = new Array();
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
var topic;
var status;
var chapter;
var time;
var timeout;
var timer = null;

export default class Activity3 extends Component {

  constructor(props) {

    time = new Array();
    answer = '';
    ans = [];

    super(props);
    for (var i = ans.length - 1; i >= 0; i--) {
      pressed[i] = false;
    }
    this.state = {
      question: '',
      answer: answer,
      ans:ans,
      length:length,
      check_ans: 0,
      correct_ans: '',
      status: 0,
      id:0,
      last:0,
      repeat:0,
      rem_rep:0,
      time:time,
      progress:1
    };

    topic = this.props.topic;
    chapter = this.props.chapter;
  console.log("recieved "+topic+chapter);
    

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM act3 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;

       console.log("len="+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({question: row.question});
        this.setState({correct_ans: row.correct});
        ans = row.words.split(',');
        this.setState({ans:ans});
        length = ans.length;
        this.setState({length:length});
        this.setState({id:row.id});

        if(len==1 && this.props.wrong == 0)
          this.setState({last:3});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:3})
      }

      
      console.log("id="+this.state.id);
    });

    });
  }


  _handleButtonPress = index => {
    if (!pressed[index]){
      pressed[index] = true;
      answer = answer + ' ' + ans[index];
      this.setState({ answer: answer });
    }
  };

  _handleSubmitPress = () => {

    console.log(this.state.answer);
    console.log(this.state.correct_ans);

    if(this.state.answer.trim() == this.state.correct_ans){
      console.log("entered");

      this.setState({check_ans: 1});
      this.setState({repeat: 0});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act3 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 3});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act3 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });
    }

    console.log(this.state.check_ans);
    this.setState({status: 1});

    this.setState({question: ''});
    this.setState({length: 0});
    this.setState({correct_ans: ''});

    for (var i = ans.length - 1; i >= 0; i--) {
      pressed[i] = false;
    }
  };

  
  _clear = () => {
    for (var i = ans.length - 1; i >= 0; i--) {
      pressed[i] = false;
    }
    answer = " ";
    this.setState({ answer: answer });
  };
  update2 = () =>{
    db.transaction((tx) => {
    tx.executeSql('UPDATE data SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
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

    console.log(length);
    
  var buttons = [];

  for(let i = 0; i < this.state.length; i++){

          buttons.push(
          <TouchableOpacity onPress={() => this._handleButtonPress(i)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{ans[i]}</Text>
              </View>
          </TouchableOpacity>
        )

  }
      
    
   if(this.state.status == 0){
    return (
 

      <View style={styles.container}>
            {topic==-1 && timer}
            <View style={styles.questBox}>
          <Text style={{ fontSize: 20 }}>
            Q: {this.state.question}
          </Text>
        </View>
        <View style={styles.ansBox}>
          <Text style={styles.answer}>
            A: {this.state.answer}
          </Text>
        </View>
        <View style={styles.hint}>
          <Text style={{ color: 'white' }}>
            Pick words from the list below to form your answer
          </Text>
        </View>
  
        <View style={styles.opsBox} >
          
          <View >
            { buttons }
          </View>

        </View>
        <View style={styles.subBox}>
            <TouchableOpacity onPress={() => this._clear()}>
              <View style={styles.button}>
                <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>CLEAR</Text>
              </View>
          </TouchableOpacity>
        </View>

        <View style={styles.subBox}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                      <View style={styles.button}>
                        <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>SUBMIT</Text>
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
  button: {
    margin: 10,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#3F51B5',
  },
  buttonText: {
    padding: 5,
  },
    opsBox: {
    flexDirection: 'row',
    flex: 5,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0',
  },
  hint: {
    paddingTop: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#5C6BC0',
  },
  ansBox: {
    flex: 2,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7986CB',
    flexDirection: 'row',
  },
  questBox: {
    flex: 2,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#9FA8DA',
  },
  subBox: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
  },
});
