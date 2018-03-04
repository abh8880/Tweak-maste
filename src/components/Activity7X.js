import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';

import * as Progress from 'react-native-progress';


var words = new Array();
var element =  new Array();
var received_supp = new Array();
received_supp = '';
var supp_words = new Array();
var ans = new Array();
var i,j=0,k=0,l=0;
ans[0]= '____ ';
ans[1]= '____ ';
ans[2]= '____ ';
ans[3]= '____ ';
ans[4]= '____ ';

var status;
var topic;
var chapter;
var timer = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'})
var correct_ans = new Array();
var time;
var timeout;
export default class Activity7 extends Component {

  constructor(props) {
    time = new Array();
    super(props);

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

    for (var i = ans.length - 1; i >= 0; i--) {
      ans[i] = '____ ';
    }
    l = 0;

    topic = this.props.topic;
  chapter = this.props.chapter;
  console.log("recieved "+topic+chapter);
  
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM act7 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;

       console.log("DB :"+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);

        this.setState({question: row.question});
        words = row.question.split(' ');
        console.log("words : " + words);

        this.setState({options: row.options});
        supp_words = row.options.split(' ');
        console.log("supp_words : " + supp_words);

        correct_ans = row.correct;
        console.log("correct_ans : " + correct_ans);
        this.setState({id:row.id});

        this.setState({words:words,supp_words:supp_words,correct_ans:correct_ans});
        this.setState({id:row.id});
        if(len==1 && this.props.wrong == 0)
          this.setState({last:7});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:7})
        
       }
          
        });
    });

  }

  _handleButtonPress = key => {
    ans[l] = key+' ';
    
    l++;

    this.setState({ element: element});
    console.log("element: " + element );

  };

  _clear = () => {
    for (var i = ans.length - 1; i >= 0; i--) {
      ans[i] = '____ ';
    }
    l = 0;
    this.setState({ element: element });
  };


  _handleSubmitPress = () => {

    answer = Array.from(element);
    answer = answer.join("");

    this.setState({answer:answer });
    console.log("my answer "+answer);
    console.log("correct answer "+correct_ans);

    if(answer === correct_ans){
      console.log("entered");        

      this.setState({check_ans: 1});
      this.setState({repeat: 0});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act7 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });
    }

    else{
      this.setState({check_ans: 0});

      this.setState({repeat: 7});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act7 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });
        
    }

    console.log(this.state.check_ans);
    this.setState({status: 1});        

    this.setState({question: ''});
    this.setState({current_ans: '_____'});
    

  };
  
  update2 = () =>{
    db.transaction((tx) => {
    tx.executeSql('UPDATE act7 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
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

    
    if(k==0)
    {
        element = [];
        j = 0;
        for( i=0 ; i<words.length; i++){
      
          if(words[i]=='_'){
              element.push(
                  ans[j]
              );
             j++;
          }
          
          else{
            element.push(
                  words[i]+" "
            );
          }
      }
      
    }
    

    
    var buttons2 = [];
    var len2 = supp_words.length;
    for(let i = 0; i < len2; i++){
  
            buttons2.push(
            <TouchableOpacity onPress={() => this._handleButtonPress(supp_words[i])}>
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
        <Progress.Bar progress={this.props.count/10} width={Dimensions.get('window').width} height={8} color={'rgba(255, 255, 255, 1)'} animated={false}/>
    </View>
    
          <View style={styles.questBox}>
          <Text>
            {element}
          </Text>
          </View>
          <View style={styles.hint}>
          <View style={styles.hintt}>
          
            <Text style={{ color: 'white' }}>
               Chose words to fill in the blanks.
            </Text>
            
          </View>
          <View style={styles.grid}>
            { buttons2 }
          </View>
          
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

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: Constants.statusBarHeight,
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
    padding: 5,
    alignItems: 'center',
    alignSelf: 'stretch',
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
  buttonText: {
    padding: 5,
  },
  hint: {
    flex: 2,
    padding: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#5C6BC0',
  },
  button: {
    margin: 5,
    width: Dimensions.get('window').width/3 - 20,
    alignItems: 'center',
    backgroundColor: '#3F51B5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

});
