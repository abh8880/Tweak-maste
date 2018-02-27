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
var bar = null;
var element = [];

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'})
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
    progress:1,
    blank1:'',
    blank2:'',
    current_ans:'',
    correct_ans:'',
    bar:0
  };

  topic = this.props.topic;
    chapter = this.props.chapter;
  
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
        console.log("in con 4="+len);

        if(len==1 && this.props.wrong == 0)
          this.setState({last:4});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:4})
       }
          
        });
    });
}

componentWillMount(){
  console.log("prop count:"+this.props.count);
this.setState({bar:this.props.count});
console.log("recieved "+topic+chapter);
console.log("bar state "+this.state.bar);
}

_handleSubmitPress = (len) => {
  //console.log(this.state.current_ans);
  console.log("submit len"+len);
  console.log("blank1="+this.state.blank1);
  console.log("blank2="+this.state.blank2);

  var answer = '';
  var k = 0;

  for(i=0;i<len;i++){
    if(words[i] == '_'){
      k++;

      if(k==1){
        answer = answer +' '+ this.state.blank1;
      }

      if(k==2){
        answer = answer +' '+ this.state.blank2;
      }
    }

    else{
      answer = answer +' '+words[i];
    }
  }

  console.log("answer="+answer);

  this.setState({current_ans:answer});

  console.log("curr ans="+this.state.current_ans);

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

    else{
      bar = <View >
        <Progress.Bar progress={this.state.bar/12} width={Dimensions.get('window').width} height={8} color={'rgba(255, 255, 255, 1)'} animated={false}/>
    </View>
    }

    console.log(this.state.words);
    element = [];
    var k = 0;
    console.log("render len="+len);
    for( i=0 ; i<len; i++){

        console.log(i);      
        if(words[i]=='_'){

            k++;

            if(k==1){
              element.push(
                <TextInput
                style={{ width: 100, height: 44, padding: 8, textAlign: 'center', fontSize:20, fontFamily: 'Museo Sans Rounded_500',}}                  onChangeText={(text) => this.setState({blank1:text})}
                />
              );
            }

            if(k==2){
              element.push(
                <TextInput
                style={{ width: 100, height: 44, padding: 8, textAlign: 'center', fontSize:20, fontFamily: 'Museo Sans Rounded_500',}}                  onChangeText={(text) => this.setState({blank2:text})}
                />
              );
            }
        }
        
        else{
          element.push(
              <Text style={{fontSize:20, fontFamily: 'Museo Sans Rounded_500',}}>{words[i]+" "}</Text>
          );
        }

    }
    
    if(this.state.status == 0){
      return (

      <View style={styles.container}>
       
       {topic==-1 && timer}
       {topic!=-1 && bar}


            <View style={styles.questBox}>
              {element}
            </View>
  
            <View style={styles.subBox}>
                      <TouchableOpacity onPress={() => this._handleSubmitPress(len)}>
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

    len = 0;
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
