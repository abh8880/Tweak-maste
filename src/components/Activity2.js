import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';

import * as Progress from 'react-native-progress';

var question = 'How are you ?';
var current_ans = 'What would be your reply?';
var ops = [];
var topic;
var chap
var id;
var status;
var time;
var timeout;
var timer = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
export default class Activity2 extends Component {
  
  constructor(props) {
  super(props);
  time = new Array();
  
  this.state = {
    question: '',
    current_ans: current_ans,
    correct_ans: '',
    ops:ops,
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
    tx.executeSql('SELECT * FROM act2 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;

       console.log("len="+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({question: row.question});
        this.setState({correct_ans: row.correct});
        ops.push(row.op1);
        ops.push(row.op2);
        ops.push(row.op3);
        ops.push(row.op4);
        this.setState({ops:ops});
        this.setState({id:row.id});

        if(len==1 && this.props.wrong == 0)
          this.setState({last:2});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:2})
      }
      
    });
    
    console.log("id="+id);

    });

}
  
  _handleButtonPress = (ans) => {
    this.setState({ current_ans:ans });
  };

  _handleSubmitPress = () => {
    console.log("current_ans " + this.state.current_ans);
    console.log(this.state.correct_ans);

    if(this.state.current_ans === this.state.correct_ans){
      console.log("entered");

      this.setState({check_ans: 1});
      this.setState({repeat: 0});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act2 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 2});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act2 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });
     
    }

    console.log("check_ans " + this.state.check_ans);
    this.setState({status: 1});

    this.setState({question: ''});
    this.setState({current_ans: ''});
    this.setState({correct_ans: ''});
    
    ops = [];

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


    if(this.state.status == 0){
      return (

        <View style={styles.container}>
            {topic==-1 && timer}
            <View style={styles.questBox}>
              <Text style={{fontSize:20}}>{this.state.question}</Text>
            </View>
            
            <View style={styles.ansBox}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>{this.state.current_ans}</Text>
            </View>
            
            <View style={styles.opsBox}>
              
                <TouchableOpacity onPress={() => this._handleButtonPress(ops[0])}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{ops[0]}</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => this._handleButtonPress(ops[1])}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{ops[1]}</Text>
                  </View>
                </TouchableOpacity>
              
                <TouchableOpacity onPress={() => this._handleButtonPress(ops[2])}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{ops[2]}</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => this._handleButtonPress(ops[3])}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{ops[3]}</Text>
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
  questBox: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#9FA8DA',
  },
  
  ansBox: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7986CB',
  },
  
  opsBox: {
    flex: 3,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0',
  },
  
  subBox: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
  },
  
  button: {
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#5C6BC0',
    marginRight: 10,
    marginLeft: 10,
    borderRadius:20
  },
  
  subButton: {
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    alignSelf: 'stretch',
  },
  
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 20,
  }
});
