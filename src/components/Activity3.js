import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet,Dimensions,ScrollView } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';
import { Card } from 'react-native-elements';
import * as Progress from 'react-native-progress';

var answer;
var ans;
var length=0;
var pressed = new Array();
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'})
var topic;
var status;
var chapter;
var time;
var timeout;
var timer = null;
var bar = null;

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
      progress:1,
      bar:0
    };

    topic = this.props.topic;
    chapter = this.props.chapter;
    

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
        ans = row.words.split(' ');
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

  componentWillMount(){
    console.log("prop count:"+this.props.count);
  this.setState({bar:this.props.count});
  console.log("recieved "+topic+chapter);
  console.log("bar state "+this.state.bar);
  }
  
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
            {topic!=-1 && bar}

    
         <View>
         <View>
          <Text  style={styles.titleQuestion}>
            Pick words from the list below to form your answer
          </Text>
        </View>
        </View>
        
            <View style={styles.questBox}>
          <Text style={{ fontSize: 20,fontFamily: 'Museo 500' }}>
            Q: {this.state.question}
          </Text>
        </View>
        <View style={styles.ansBox}>
          <Text style={styles.answer}>
            A: {this.state.answer}
          </Text>
        </View>
       
            <View style={styles.opsBox}>
             <ScrollView>
            <Card containerStyle={{width:Dimensions.get('window').width-20,
              alignItems:'center'}}>
             
               
                { buttons }
               
            
             </Card>
             </ScrollView>
            </View>
      <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={styles.subBox1}>
              <TouchableOpacity onPress={() => this._clear()}>
                  <View style={styles.button1}>
                <Text style={{fontSize:20,  fontFamily: 'Museo 500', color:'#1c313a'}}>CLEAR</Text>
                </View>
              </TouchableOpacity>
              </View>


              <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                          <View style={styles.button2}>
                        <Text style={{fontSize:20, fontFamily: 'Museo 500', color:'#ffffff'}}>SUBMIT</Text>
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
    backgroundColor: '#e5e5e5',
  },
  timer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 20,
    alignSelf: 'flex-start'

  },
  questBox: {
    flex: 1,
    alignItems:'center',
    alignSelf:'stretch',
    backgroundColor: '#ffffff'
  },
  answer:{
    fontSize:20,
     fontFamily: 'Museo 500', color:'#1c313a'
  },
  ansBox: {
    flex: 0.5,
    alignItems:'center',
    alignSelf: 'stretch',
    backgroundColor: '#ffffff'
  },

  
  ansLine: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  
  opsBox: {
    flex:6,
    width:Dimensions.get('window').width,
    paddingBottom:30,
    backgroundColor: '#ffffff',
    alignItems:'center'
  },
  
  clearBox: {
    width:window.width/2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
  },
   subBox1: {
     flex:1,
     alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent:'center',
    
  },
  subBox2: {
   
     flex:1,
     alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  
  buttonLine: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  
  button: {
     width: Dimensions.get('window').width/1.5,
    alignItems: 'center',
    margin:5,
    backgroundColor: '#1c313a',
    borderRadius: 10,
    height:Dimensions.get('window').height/15,
    justifyContent:'center'
  },
    
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 15,
     fontFamily: 'Museo 500',
   
  },
 titleQuestion:{
     justifyContent:'center',
     fontSize:15,
     fontFamily: 'Museo 500',
     padding:10,
     marginLeft:9,
     color:'#000000',
     margin:20
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
   button2:{
     padding:10,
     width:Dimensions.get('window').width/2.5,
    height:Dimensions.get('window').height/10,  
    alignItems: 'center',
    backgroundColor: '#1c313a',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:10,
     borderColor:'#1c313a',
   
   }
});
