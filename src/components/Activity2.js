import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';
import { Card } from 'react-native-elements';
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
var bar = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'})
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

    else{
      bar = <View >
        <Progress.Bar progress={0.5} width={Dimensions.get('window').width} height={8} color={'rgba(255, 255, 255, 1)'} animated={false}/>
    </View>
    }


    if(this.state.status == 0){
      return (

        <View style={styles.container}>
            {topic==-1 && timer}
            {topic!=-1 && bar}

            
          <View style={{flex:1}}>
          <Text style={styles.titleQuestion}>
        Choose the correct sentence for the given question
          </Text>
          </View>
            <View style={styles.questBox}>
              <Text style={{fontSize:20,justifyContent: 'center',  fontFamily: 'Museo 500',}}>{this.state.question}</Text>
            </View>
            
            <View style={styles.ansBox}>
                <Text style={{fontSize:20, fontFamily: 'Museo 500',}}>{this.state.current_ans}</Text>
            </View>
            
            <View style={styles.opsBox}>
              <Card>
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
               </Card>             
            </View>
  
            <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                         <View style={styles.button2}>
                        <Text style={{fontSize:20, fontFamily: 'Museo 500', color:'#ffffff'}}>SUBMIT</Text>
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
    backgroundColor: '#ffffff',
  },
  timer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 20,
    alignSelf: 'flex-start'

  },
  questBox: {
   
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems:'center'
  },
  
  ansBox: {
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    alignItems:'center'
  },
  
  opsBox: {
    alignItems:'center',
    borderRadius:5,
    alignSelf:'center'
  },
  
  subBox2: {
    marginTop:'20%',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom:20
   
  },
  
  button: {
    width: 250,
    margin:5,
    alignItems: 'center',
    backgroundColor: '#1c313a',
    borderRadius: 5,
    height:40,
    justifyContent:'center'
  },
  
  subButton: {
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    alignSelf: 'stretch',
    
  },
  
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 15,
    fontFamily: 'Museo 500',
  },
  
    button2: {
     padding:10,
    width:Dimensions.get('window').width/2.5,
    height:Dimensions.get('window').height/10,  
    alignItems: 'center',
    backgroundColor: '#1c313a',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:10,
     borderColor:'#1c313a',
  },
titleQuestion:{
     justifyContent:'center',
     fontSize:18,
     padding:10,
     marginLeft:9,
     color:'#000000',
     margin:20,
     fontFamily: 'Museo 500',
 }
});
