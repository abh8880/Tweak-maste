import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';
import ModalView from './ModalView';
import Modal from "react-native-modal";
import { Card } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
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
    bar:0,
    isModalVisible:false
  };

  topic = this.props.topic;
    chapter = this.props.chapter;

    if (topic==-1) 
    {
        db.transaction((tx) => {
        tx.executeSql('SELECT * FROM tact3 WHERE chapter=? AND status=?', [chapter,0], (tx, results) => {

           var length = results.rows.length;

           console.log("DB:"+length);

           if(length > 0){
            var rand = Math.floor(Math.random()*(length-1))+0;
            console.log("rand="+rand)
            var row = results.rows.item(rand);
            console.log(row)
            this.setState({question: row.question});
            this.setState({correct_ans: row.correct});
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
    else
    {
      db.transaction((tx) => {
       tx.executeSql('SELECT * FROM act4 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var length = results.rows.length;

       console.log("DB:"+length);

       if(length > 0){
        var rand = Math.floor(Math.random()*(length-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({question: row.question});
        this.setState({correct_ans: row.correct});
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

  for(var i in words){

    if(words[i] == '_'){
      k++;

      if(k==1){
        answer = answer +' '+ this.state.blank1;
      }

      if(k==2){
        answer = answer +' '+ this.state.blank2;
      }
    }

    else if(words[i].charAt(0)!="("){
      answer = answer +' '+words[i];
    }
  }

  answer = answer.trim();

  if(answer.charAt(answer.length-1)!='.'){
    answer=answer+".";
  }

  console.log("answer="+answer);

  if(answer === this.state.correct_ans){
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
  this.setState({isModalVisible: true});
        
};

_handleNextPress(){
  this.setState({status:1});
}

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
      timer = <View style={{flexDirection:'row'}}>
       <View style={{flex:0.3,margin:'2%'}}>
        <TouchableOpacity>
         <Icon name="close" size={30} color="#000000" />
         </TouchableOpacity>
       </View>

          <View style={{flex:3,margin:'5%',alignItems:'center',}}>
              <Progress.Bar progress={this.state.progress} width={Dimensions.get('window').width-80} height={8} 
              unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'}/>
           </View>
          </View>;
    }

    else{
      bar =  <View style={{flexDirection:'row'}}>
       <View style={{flex:0.3,margin:'2%'}}>
        <TouchableOpacity>
         <Icon name="close" size={30} color="#000000" />
         </TouchableOpacity>
       </View>

          <View style={{flex:3,margin:'5%',alignItems:'center',}}>
        <Progress.Bar progress={this.state.bar/12} width={Dimensions.get('window').width-80} 
        height={8} unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'} animated={false}/>
          </View>
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
                style={{textAlign: 'center', fontSize:20, fontFamily: 'Museo 500',color:'#1c313a'}}                  
                  onChangeText={(text) => this.setState({blank1:text})}
                />
              );
            }

            if(k==2){
              element.push(
                <TextInput
                style={{textAlign: 'center', fontSize:20, fontFamily: 'Museo 500',color:'#1c313a'}}                
                  onChangeText={(text) => this.setState({blank2:text})}
                />
              );
            }
        }
        
        else{
          element.push(
              <Text style={{fontSize:20, fontFamily: 'Museo 500',}}>{words[i]+" "}</Text>
          );
        }

    }
    
    if(this.state.status == 0){
      return (

      <View style={styles.container}>
       
       {topic==-1 && timer}
       {topic!=-1 && bar}

            
            <View>
         <View>
           <Text style={styles.titleQuestion}>
       Fill in the blanks with correct form of word given in brackets
          </Text>
        </View>
        </View>
            <View style={styles.questBox}>
              {element}
            </View>
  
             <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                          <View style={styles.button2}>
                        <Text style={{fontSize:20, fontFamily: 'Museo 500', color:'#ffffff'}}>SUBMIT</Text>
                        </View>
                    </TouchableOpacity>
            </View>

             <Modal isVisible={this.state.isModalVisible}
              animationIn="slideInLeft"
              animationOut="slideOutRight">
             <View style={styles.modalContent}>
             <ModalView correct={this.state.correct_ans} score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
             <TouchableOpacity style={{width:'100%'}} onPress={() => this._handleNextPress()}>
              <View style={{alignItems: 'center',justifyContent: 'center',backgroundColor: '#1c313a',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                   
                      <View style={styles.buttonM}>
                        <Text style={{fontSize:20, color:'#ffffff',fontFamily:'Museo 500'}}>NEXT</Text>
                      </View>

                </View>
               </TouchableOpacity>
             
            </View>
          </Modal>
          
        </View>
      );
    }

    else if(this.state.status == 1){
      clearTimeout(timeout);
      console.log("rep_state="+this.state.repeat);
        console.log("rem_rep_state="+this.state.rem_rep);
        return(
          <Select score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
        );
    }

    len = 0;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    margin:'2%'
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
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  
  subBox2: {
   
     flex:1,
     alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  
   button2:{
     padding:10,
     width:Dimensions.get('window').width/2.5,
    height:Dimensions.get('window').height/10,  
    alignItems: 'center',
    backgroundColor: 'green',
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
 },
  buttonM:{
    margin: 20,
    alignItems: 'center',
    borderRadius: 10
  },
  modalContent:{
     backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
   

  }
});
