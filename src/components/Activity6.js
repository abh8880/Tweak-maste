import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';
import { Card } from 'react-native-elements';
import * as Progress from 'react-native-progress';


var received_comp = new Array();
received_comp = 'apple ate';
var comp_words = new Array();
var answer = '';
var message1 = 'Compulsary words';
var word = '';
var pressed = new Array();
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
var correct_ans = new Array();
var time;
var timeout;
var status;
var timer = null;

var topic;
var chapter;
export default class Activity6 extends Component {
  constructor(props) {
    time = new Array();
    super(props);

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
    var rand = Math.floor(Math.random()*3)+1;

    topic = this.props.topic;
  chapter = this.props.chapter;
  console.log("recieved "+topic+chapter);
  
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM act6 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;

       console.log("DB :"+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({comp_words: row.words});
        comp_words = row.words.split(',');
        correct_ans = row.correct;
        console.log("correct ans " + correct_ans);
        this.setState({id:row.id});
        this.setState({comp_words:comp_words,answer:answer,correct_ans:correct_ans});
        this.setState({id:row.id});
        if(len==1 && this.props.wrong == 0)
          this.setState({last:6});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:6})
        
       }
          
        });
    });
  }


  _handleButtonPress = index => {
    if (!pressed[index]){
      pressed[index] = true;
      if (answer=='') {
        answer = comp_words[index];
      }
      else
      {
        answer = answer + ' ' + comp_words[index];   
      }
      this.setState({ answer: answer });
    }
  };

  _addWord = () => {
    if (answer=='') {
      answer = word;
    }
    else{
      answer = answer + ' ' + word;
    }
    this.setState({ answer: answer });
    this.textInput.clear();
  };

  _clear = () => {
    for (var i = comp_words.length - 1; i >= 0; i--) {
      pressed[i] = false;
    }
    answer = ' ';
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
        tx.executeSql('UPDATE act6 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 6});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act6 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
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
    tx.executeSql('UPDATE act6 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
    });
  
  });
  };
  render() {
    // comp_words = received_comp.split(' ');
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
    for (let i = 0; i < len1; i++) {
      buttons1.push(
        <TouchableOpacity
          onPress={() => this._handleButtonPress(i)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{comp_words[i]}</Text>
          </View>
        </TouchableOpacity>
      );
    }
      if(this.state.status == 0){
      return (

      <View style={styles.container}>
       
        {topic==-1 && timer}
        <Text style={styles.titleQuestion}>
         Chose compulsary words from above and put your own supplementary words to make a meaningful sentence!
          </Text>
          
                <View style={styles.supBox}>
          
                    <Text style={styles.title}>
                      Your answer..
                    </Text>

                    <View style={styles.grid}>
                      <Text style={styles.input}>{answer}</Text>
                    </View>
                  
                    <View style={styles.compBox}>
                                 <Card title="Compulsory Words">

                                <View style={styles.grid}>
                                  {buttons1}
                                </View>
                              </Card>
                      </View>
                      </View>
                    <View style={styles.typeAnsBox}>
                    <Text style={styles.title}>
                      Type here
                    </Text>

                    <View style={styles.grid}>
                              <TextInput
                                ref={input => {
                                  this.textInput = input;
                                }}
                                style={styles.input}
                                placeholder="Answer"
                                onChangeText={text => {
                                  word = text;
                                }}
                              />
                              <TouchableOpacity onPress={() => this._addWord()}>
                                <View style={styles.add}>
                                  <Text style={styles.buttonText}>Go</Text>
                                </View>
                            </TouchableOpacity>
                    </View>
                </View>
        
         
          <View style={{flex: 3, flexDirection: 'row'}}>
              <View style={styles.subBox1}>
              <TouchableOpacity onPress={() => this._clear()}>
                <View style={styles.button1}>
                <Text style={{fontSize:15, fontWeight:'bold', color:'#1c313a'}}>CLEAR</Text>
              </View>
              </TouchableOpacity>
              </View>


              <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                         <View style={styles.button2}>
                        <Text style={{fontSize:15,fontWeight:'bold', color:'#ffffff'}}>SUBMIT</Text>
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
  input: {
    margin: 5,
    marginLeft: 15,
    height: 40,
    flex: 0.9,
  },
  button: {
   borderRadius:10,
    margin: 5,
    width: Dimensions.get('window').width/3 - 20,
    alignItems: 'center',
    backgroundColor: '#1c313a',
  },
  add: {
    margin: 5,
    width: 50,
    alignItems: 'center',
    backgroundColor: '#1c313a',
  },
  buttonText: {
    padding: 5,
    color:'#ffffff'
  },
  hint: {
    padding: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#5C6BC0',
  },
  hintt: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  supBox: {
    flex:5,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
  },
   compBox: {
    
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
  },
  subBox1: {
    flex:1,
    alignItems: 'center',
     alignSelf: 'stretch',
    justifyContent: 'center',
   
    
  },
  subBox2: {
    flex:1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
   
  },
  text: {
    padding: 10,
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    alignSelf:'stretch'
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
    padding:10,
   width:Dimensions.get('window').width/2.5,
    height:Dimensions.get('window').height/10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:10,
     borderColor:'#1c313a',
    
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
 title:{
     margin:10,
     fontWeight:'bold',
     fontSize:15
 },
typeAnsBox:{
    alignSelf:'stretch',
    backgroundColor:'#ffffff'
}
});
