import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';
import * as Progress from 'react-native-progress';
import { Card } from 'react-native-elements';
var current_ans = '_____';
var ops = [];
var anspart = [];
var topic;
var chapter;
var id;
var time;
var status;
var timeout;
var timer = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
export default class Activity1 extends Component {
  
  constructor(props) {
  time = new Array();
  super(props);
  
  this.state = {
    question : '',
    answer : '',
    current_ans: current_ans,
    correct_ans: '',
    check_ans: 0,
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
      console.log("mode="+this.props.wrong);
       tx.executeSql('SELECT * FROM act1 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;
       console.log("len="+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        console.log("c="+row.correct);
        console.log("status="+row.status);
        this.setState({question: row.question});
        this.setState({answer: row.answer});
        this.setState({correct_ans: row.correct});
        ops.push(row.op1);
        ops.push(row.op2);
        ops.push(row.op3);
        ops.push(row.op4);
        this.setState({ops:ops});
        this.setState({id:row.id});

        if(len==1 && this.props.wrong == 0)
          this.setState({last:1});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:1})
      }
      
    });
    
    console.log("id="+id);

    });    
}
  
  _handleButtonPress = (ans) => {
    this.setState({ current_ans:ans });
  };

  _handleSubmitPress = () => {
    console.log(this.state.current_ans);
    console.log(this.state.correct_ans);

    if(this.state.current_ans === this.state.correct_ans){
      console.log("entered");

      // if (topic == -1) 
      //   

      this.setState({check_ans: 1});
      this.setState({repeat: 0});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act1 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });

    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 1});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act1 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });
    }

    console.log(this.state.check_ans);
    this.setState({status: 1});
      
    this.setState({question: ''});
    this.setState({current_ans: '_____'});
    this.setState({correct_ans: ''});
    
    ops = [];
    anspart = [];
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

    anspart = this.state.answer.split('_');
      
    if(this.state.status == 0){
      return (
        

        <View style={styles.container}>
            {topic==-1 && timer}
            <View style={styles.questBox}>
              <Text style={{fontSize:20,fontWeight:'bold'}}>{this.state.question}</Text>
            </View>
            
            <View style={styles.ansBox}>
              <View style={styles.ansLine}>
                <Text style={{fontSize:20,fontWeight:'bold'}}>{anspart[0]}</Text>
                <Text style={{fontSize:20, fontWeight:'bold'}}>{this.state.current_ans}</Text>
                <Text style={{fontSize:20,fontWeight:'bold'}}>{anspart[1]}</Text>
              </View>
            </View>
            <Card>
            <View style={styles.opsBox}>
              
              <View style={styles.buttonLine}>
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
              </View>
              
              <View style={styles.buttonLine}>
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
                            
            </View>
            </Card>
            <View style={styles.subBox}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                      <View style={styles.button1}>
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
    backgroundColor: '#e5e5e5',
  },
  timer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 20,
    alignSelf: 'flex-start'

  },
  questBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
  },
  
  
  ansBox: {
   flex: 2,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ansLine: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  
  opsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'stretch',
    borderRadius:5
  },
  
  subBox: {
  flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  
  },
  
  buttonLine: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  
  button: {
    margin: 20,
    width:100,
    alignItems: 'center',
    backgroundColor: 'rgba(9, 22, 200, 0.6)',
    borderRadius: 10
  },
  
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
     button1: {
    margin: 25,
    width: 320,
    height:50,
    alignSelf:'center',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#1c3370',
    borderRadius:5
  },
  titleQuestion:{
     justifyContent:'center',
     fontSize:22,
     fontWeight:'bold',
     padding:10,
     marginLeft:9,
     color:'#000000'
 },
  
});
