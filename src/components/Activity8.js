import React, { Component } from 'react';
import { Text, View, TouchableOpacity,TouchableHighlight, StyleSheet,Dimensions } from 'react-native';
import Result from './Result';
import Select from './Select';
import Time_up from './Time_up';

import * as Progress from 'react-native-progress';

var sentence = new Array();

sentence = 'We is students.';

var words = new Array();
var pressed = new Array();

var topic;
var chapter;
var status;
var answer = '';
var len = 0;
var correct_ans = new Array();
var time;
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
var timer = null;
var timeout;

export default class Activity8 extends Component {
    

  constructor(props) {
    super(props);
    time = new Array();
    for (var i = words.length - 1; i >= 0; i--) {
    	pressed[i] = false;
    }

    answer = '';
    this.state = {
      answer: answer,
      len:len,
      sentence: sentence,
      correct_ans: '',
      check_ans: 0,
      status: 0,
      id:0,
      last:0,
      time:time,
      repeat:0,
      rem_rep:0,
      progress:1
    };


    topic = this.props.topic;
    chapter = this.props.chapter;
  console.log("recieved "+topic+chapter);
    
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM act8 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var length = results.rows.length;

       console.log("DB:"+length);

       if(length > 0){
        var rand = Math.floor(Math.random()*(length-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({sentence: row.sentence});
        console.log(this.state.sentence);
        words = row.sentence.split(" ");
        console.log(this.state.words);
        this.setState({words:words});
        len = words.length;
        this.setState({len:len});

        correct_ans = row.correct;
        console.log("correct ans " + correct_ans);
        this.setState({correct_ans:correct_ans});
        this.setState({id:row.id});
        if(len==1 && this.props.wrong == 0)
          this.setState({last:8});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:8})

       }
          
        });
    });

  }


  _handleButtonPress = index => {
  	if (!pressed[index]){
  		pressed[index] = true;
    	answer = words[index];
    	this.setState({ answer: answer});
	}
  };

  
  _clear = () => {
    answer = " ";
    this.setState({ answer: answer });
  };
  
   _handleSubmitPress = () => {
    console.log("my answer "+this.state.answer);
    console.log("correct answer "+this.state.correct_ans);


    if(this.state.answer === this.state.correct_ans){
      console.log("entered");
        
      this.setState({check_ans: 1});
      this.setState({repeat: 0});
 
      db.transaction((tx) => {
        tx.executeSql('UPDATE act8 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 8});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act8 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });
        
    }

    console.log(this.state.check_ans);
    this.setState({status: 1});        

    this.setState({question: ''});
    this.setState({current_ans: '_____'});
    this.setState({correct_ans: ''});

  };
  

  update2 = () =>{
    db.transaction((tx) => {
    tx.executeSql('UPDATE act8 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
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


  // words = sentence.split(" ");
  
  var buttons1 = [];
  // var len1 = words.length;
	for(let i = 0; i < len; i++){

      		buttons1.push(
	        <TouchableHighlight onPress={() => this._handleButtonPress(i)}>
              <View >
                <Text style={styles.buttonText}>{words[i]}</Text>
              </View>
          </TouchableHighlight>
		    )

	}
	

    if(this.state.status == 0){  
    return (

      <View style={styles.container}>
        {topic==-1 && timer}
        
        <View >
        <Progress.Bar progress={this.props.count/10} width={Dimensions.get('window').width} height={8} color={'rgba(255, 255, 255, 1)'}/>
    </View>


        <View style={styles.compBox}>
          <View style={styles.grid}>
      			{ buttons1 }
      		</View>
        </View>

        <View style={styles.hint}>
          <Text style={{ color: 'white' }}>
            Click the word that makes the sentence sound wrong.
          </Text>
        </View>
        <View style={styles.opsBox} >
          <Text style={{fontSize:20}}>
            {answer}
          </Text>
        </View>
        <View style={styles.subBox}>
            <TouchableOpacity onPress={() => this._clear()}>
              <View style={styles.button}>
                <Text style={{fontSize:20, fontWeight:'bold', color:'#BB0000'}}>CLEAR</Text>
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
       else if(status == 3){        

        return(
          <Time_up topic={topic} chapter={chapter} end={this.state.last}/> 
        );
       }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#34495e',
  },
  timer: {
    flexDirection: 'row',
  	backgroundColor: '#FFFFFF',
  	height: 20,
    alignSelf: 'flex-start'
  },
  button: {
    margin: 5,
    width: Dimensions.get('window').width/3 - 20,
    alignItems: 'center',
    backgroundColor: '#3F51B5',
  },
  buttonText: {
    padding: 5,
    fontSize: 25,
  },
    opsBox: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0',
  },
  hint: {
    padding: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#5C6BC0',
  },
  supBox: {
    flex: 4,
    alignSelf: 'stretch',
    backgroundColor: '#7986CB',
  },
  compBox: {
    flex: 4,
    alignSelf: 'stretch',
    backgroundColor: '#9FA8DA',
  },
  subBox: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
  },
  text: {
    padding: 10,
    fontSize: 18,
  },
  grid: {
  	padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 50
  },
});
