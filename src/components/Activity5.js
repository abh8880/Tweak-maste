import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';

import * as Progress from 'react-native-progress';
import { Card } from 'react-native-elements';
var comp_words = new Array();
var supp_words = new Array();
var answer = '';
var message1 = 'Compulsary words';
var message2 = 'Supplementary words';
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
var timer = null;

var correct_ans = new Array();

var pressed = new Array();
var status;
var time;
var timeout;

var topic;
var chapter;
export default class Activity5 extends Component {
    
  constructor(props) {
    super(props);
    time = new Array();

    for (var i = comp_words.length - 1; i >= 0; i--) {
      pressed[i] = false;
    }
    answer = '';
    this.state = {
      answer: answer,
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
      tx.executeSql('SELECT * FROM act5 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;

       console.log("DB :"+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        comp_words = row.comp_words.split(',');
        supp_words = row.supp_words.split(',');
        correct_ans = row.correct;
        console.log("correct ans " + correct_ans);
        this.setState({id:row.id});

        this.setState({supp_words: row.supp_words,comp_words: row.comp_words,correct_ans:correct_ans});
        this.setState({id:row.id});
        if(len==1 && this.props.wrong == 0)
          this.setState({last:5});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:5})
        
       }
          
        });
    });

  }


  _handleButtonPress = index => {
    if (!pressed[index]){
      pressed[index] = true;
      if (answer=='') {
          answer = answer + comp_words[index];
      }
      else
      {
        answer = answer + ' ' + comp_words[index];
      }
      this.setState({ answer: answer });
    }
  };

  _handleButtonPressS = index => {
      if (answer=='') {
        answer = answer + supp_words[index];
      }
      else
      {
        answer = answer + ' ' + supp_words[index];
      }
      this.setState({ answer: answer });
  };
  
  _clear = () => {
    for (var i = comp_words.length - 1; i >= 0; i--) {
      pressed[i] = false;
    }
    answer = '';
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
        tx.executeSql('UPDATE act5 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 5});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act5 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
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
    tx.executeSql('UPDATE act5 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
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


  var buttons1 = [];
  var len1 = comp_words.length;
	for(let i = 0; i < len1; i++){

      		buttons1.push(
	        <TouchableOpacity onPress={() => this._handleButtonPress(i)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{comp_words[i]}</Text>
              </View>
          </TouchableOpacity>
		    )

	}

  
  var buttons2 = [];
  var len2 = supp_words.length;
	for(let i = 0; i < len2; i++){

      		buttons2.push(
	        <TouchableOpacity onPress={() => this._handleButtonPressS(i)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{supp_words[i]}</Text>
              </View>
          </TouchableOpacity>
		    )

	}
    if(this.state.status == 0){
      return (

        <View style={styles.container}>
       

        {topic==-1 && timer}

        <View >
        <Progress.Bar progress={this.props.count/10} width={Dimensions.get('window').width} height={8} color={'rgba(255, 255, 255, 1)'}/>
    </View>

        <Text style={styles.titleQuestion}>
         Pick the words from the list to form your answer
          </Text>
          
          <View style={styles.opsBox} >
            <Text style={{fontSize:20}}>
              {answer}
            </Text>
          </View>
          <View style={styles.compBox}>
          <Card>
            <Text style={styles.text}>
              {message1}
            </Text>
            <View style={styles.grid}>
        			{ buttons1 }
        		</View>
          </Card>
          </View>
          
          <View style={styles.supBox}>
          <Card>
            <Text style={styles.text}>
              {message2}
            </Text>
            <View style={styles.grid}>
        			{ buttons2 }
        		</View>
           </Card>
          </View>
          
         <View style={{flex: 3, flexDirection: 'row'}}>
              <View style={styles.subBox1}>
              <TouchableOpacity onPress={() => this._clear()}>
              <View style={styles.button1}>
                <Text style={{fontSize:15, fontWeight:'bold', color:'#ffffff'}}>CLEAR</Text>
              </View>
              </TouchableOpacity>
              </View>


              <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                      <View style={styles.button1}>
                        <Text style={{fontSize:15, color:'#ffffff'}}>SUBMIT</Text>
                      </View>
                    </TouchableOpacity>
            </View>
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
    alignItems: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e5e5e5',
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
  },
    opsBox: {
   flexDirection: 'row',
    flex:2,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  hint: {
    flex:1,
    justifyContent:'center',
    backgroundColor: '#ffffff',
  },
  supBox: {
    flex:10,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
  },
  compBox: {
    flex:8,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
  },
  subBox1: {
    flex:2,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
     borderWidth:5
  },
  subBox2: {
    flex:2,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth:5
  },
  text: {
    padding: 10,
    fontSize: 18,
  },
  grid: {

    flexDirection: 'row',
    flexWrap: 'wrap'
  },
titleQuestion:{
     justifyContent:'center',
     fontSize:15,
     fontWeight:'bold',
     padding:10,
     marginLeft:9,
     color:'#000000'
 },
    button1: {
    width:Dimensions.get('window').width/2,
    height:Dimensions.get('window').height/10,
    alignItems: 'center',
    backgroundColor: '#1c3370',
    justifyContent:'center'
  },
});
