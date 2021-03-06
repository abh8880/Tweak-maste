import React, { Component } from 'react';

import { Text, View, TouchableOpacity, StyleSheet,Dimensions,ScrollView, Alert,BackHandler } from 'react-native';

import Result from './Result';
// import Time_up from './Time_up';
import Select from './Select';
import ModalView from './ModalView';
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

var comp_words = new Array();
var supp_words = new Array();
var answer = '';
var message1 = 'Compulsary words';
var message2 = 'Supplementary words';
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'})
var timer = null;
var bar = null;

var correct_ans = new Array();

var pressed_comp = new Array();
var pressed_supp = new Array();
var status;
var time;
var timeout;
var timer_on = 1;
var topic;
var chapter;
export default class Activity5 extends Component {
    
  constructor(props) {
    super(props);

    time = new Array();

    for (var i = comp_words.length - 1; i >= 0; i--) {
      pressed_comp[i] = false;
    }
    for (var i = supp_words.length - 1; i >= 0; i--) {
      pressed_supp[i] = false;
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
      progress:1,
      bar:0,
      isModalVisible:false,
    };

    topic = this.props.topic;
  chapter = this.props.chapter;
  
  if (topic==-1) 
  {
      db.transaction((tx) => {
      tx.executeSql('SELECT * FROM tact2 WHERE chapter=? AND status=?', [chapter,0], (tx, results) => {

       var len = results.rows.length;

       console.log("DB :"+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        console.log(row)
        comp_words = row.comp_words.split(' ');
        supp_words = row.supp_words.split(' ');
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
  else
  {
      db.transaction((tx) => {
      tx.executeSql('SELECT * FROM act5 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;

       console.log("DB :"+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        comp_words = row.comp_words.split(' ');
        supp_words = row.supp_words.split(' ');
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


  }

  componentWillMount(){
    console.log("prop count:"+this.props.count);
  this.setState({bar:this.props.count});
  console.log("recieved "+topic+chapter);
  console.log("bar state "+this.state.bar);
  }

  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () =>{
    return true;
  }

  _handleButtonPress = index => {
    if (!pressed_comp[index]){
      pressed_comp[index] = true;
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
    if (!pressed_supp[index]){
      pressed_supp[index] = true;
      if (answer=='') {
        answer = answer + supp_words[index];
      }
      else
      {
        answer = answer + ' ' + supp_words[index];
      }
      this.setState({ answer: answer });
    }
  };

  _show_alert(){
    Alert.alert(
      'Hello !',
      'Do you really want to exit?',
      [
        {text: 'Yes', onPress: () => Actions.lesson({Chapter:chapter})},
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: true }
    )
  }
  
  _clear = () => {
    for (var i = comp_words.length - 1; i >= 0; i--) {
      pressed_comp[i] = false;
    }
    for (var i = supp_words.length - 1; i >= 0; i--) {
      pressed_supp[i] = false;
    }
    answer = '';
    this.setState({ answer: answer });
  };

    _handleSubmitPress = () => {
    console.log("my answer "+this.state.answer);
    console.log("correct answer "+this.state.correct_ans);
clearTimeout(timeout);
timer_on = 0;
    var final_answer = this.state.answer.trim();
    final_answer = final_answer+".";
    final_answer = final_answer.charAt(0).toUpperCase() + final_answer.slice(1);
    console.log("Final answer="+final_answer);

    if(final_answer === this.state.correct_ans){
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
    this.setState({isModalVisible: true});
        
    this.setState({question: ''});
    this.setState({current_ans: '_____'});
    

  };

  _handleNextPress(){
    this.setState({status:1});
  }

  update2 = () =>{
    db.transaction((tx) => {
    tx.executeSql('UPDATE act5 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
    });
  
  });
  };


  render() {

    if(topic == -1){
      clearTimeout(timeout);
      if (timer_on ==1) 
      {
        timeout = setTimeout((function() {
          this.setState({ progress: this.state.progress - 0.1});
        }).bind(this), 1000);
      }
  
      console.log("progress="+this.state.progress);
  
      if(this.state.progress<0&&this.state.progress>-2){
        console.log("less");
        clearTimeout(timeout);
        this.update2();
        // return(
      Alert.alert(
        'Time up!!',
        'Please proceed to the next question',
        [
          {text: 'Next question', onPress: () => this._handleNextPress()},
        ],
        { cancelable: false }
      )
      this.setState({progress:-3})

          //  Alert.alert(
          //   'Time up!!',
          //   [
          //     {text: 'Next Question', onPress: () => this._next_question()},
          //   ],
          //   { cancelable: false }
          // )


          // <Time_up topic={topic} chapter={chapter} end={this.state.last}/> 
        // );
      }
  
    }

    if (topic == -1) 
    {
      timer =<View style={{flexDirection:'row'}}>
       <View style={{flex:0.3,margin:'2%'}}>
        <View >
        <TouchableOpacity onPress={this._show_alert}>
           <View style={ styles.instructionBox}>
              <Icon name="md-close" size={30} color="#850631" />
          </View>
        </TouchableOpacity>
      </View>
       </View>

          <View style={{flex:3,margin:'5%',alignItems:'center',}}>
              <Progress.Bar progress={this.state.progress} width={Dimensions.get('window').width-80} height={8} 
              unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'}/>
           </View>
       </View>;
    }

    else{
      bar = <View style={{flexDirection:'row'}}>
       <View style={{flex:0.3,margin:'2%'}}>
         <View >
        <TouchableOpacity onPress={this._show_alert}>
           <View style={ styles.instructionBox}>
              <Icon name="md-close" size={30} color="#850631" />
          </View>
        </TouchableOpacity>
      </View>
       </View>

          <View style={{flex:3,margin:'5%',alignItems:'center',}}>
        <Progress.Bar progress={this.state.bar/12} width={Dimensions.get('window').width-80} 
        height={8} unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'} animated={false}/>
       </View>
     </View>
    }


  var buttons1 = [];
  var len1 = comp_words.length;
	for(let i = 0; i < len1; i++){

      		buttons1.push(
          <View>
          {pressed_comp[i]?null
          :<TouchableOpacity onPress={() => this._handleButtonPress(i)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{comp_words[i]}</Text>
              </View>
          </TouchableOpacity>}
          </View>
	        
		    )

	}

  
  var buttons2 = [];
  var len2 = supp_words.length;
	for(let i = 0; i < len2; i++){

      		buttons2.push(
          <View>
          {pressed_supp[i]?null
          :<TouchableOpacity onPress={() => this._handleButtonPressS(i)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{supp_words[i]}</Text>
              </View>
          </TouchableOpacity>}
          </View>
	        
		    )

	}
    if(this.state.status == 0){
      return (

        <View style={styles.container}>
       
       {topic==-1 && timer}
       {topic!=-1 && bar}

                <Text style={styles.titleQuestion}>
                 Pick the words from the list to form your answer
                  </Text>
          
                  <View style={styles.opsBox} >
                    <Text style={{fontSize:18,fontFamily:'Museo 500'}}>
                      {answer}
                    </Text>
                  </View>
                  <View style={styles.compBox}>
                  <Text style={styles.text1}>
                    Compulsory Words
                      </Text>
                

                    <View style={styles.grid}>
                            { buttons1 }
                        </View>
                  
                  </View>
          
          <View style={styles.supBox}>
             <Text style={styles.text1}>
                    Supplementary Words
                      </Text>
        
               <ScrollView  showsVerticalScrollIndicator> 
            <View style={styles.grid}>
             
        			{ buttons2 }
               
        		</View>
               </ScrollView>
           
            
            </View>
         <View style={{flex: 2, flexDirection: 'row',marginTop:'5%'}}>
              <View style={styles.subBox1}>
              <TouchableOpacity onPress={() => this._clear()}>
                  <View style={styles.button1}>
                <Text style={{fontSize:20,color:'#1c313a', fontFamily: 'Museo 500',}}>CLEAR</Text>
                </View>
              </TouchableOpacity>
              </View>


              <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                          <View style={styles.button2}>
                        <Text style={{fontSize:20,fontFamily: 'Museo 500', color:'#ffffff'}}>SUBMIT</Text>
                        </View>
                    </TouchableOpacity>
            </View>
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
  }
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e5e5e5',
    margin:'2%'
  },
  timer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 20,
    alignSelf: 'flex-start'
  },
  button: {
    borderRadius:10,
    margin: 5,
    width: Dimensions.get('window').width/3 - 20,
    alignItems: 'center',
    backgroundColor: '#1c313a',
  },
  buttonText: {
    padding: 5,
    color:'#ffffff',
     fontFamily: 'Museo 500',
  },
    opsBox: {
   flex:2,
   flexDirection: 'row',
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
     flex:6,
     width:Dimensions.get('window').width,
    height:Dimensions.get('window').height/10,
    backgroundColor: '#ffffff',
    elevation:5,
    
  },
  compBox: {
    flex:3,
    alignItems:'center',
    width:Dimensions.get('window').width,
    backgroundColor: '#ffffff',
    elevation:5,
    marginBottom:'5%'
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
  text: {
    padding: 10,
    fontSize: 18,
    fontFamily: 'Museo 500',
  },
   text1: {
    alignSelf:'center',
    fontSize: 18,
    fontFamily: 'Museo 500',
  },
  grid: {
    alignItems:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin:'2%'
  },
titleQuestion:{
     justifyContent:'center',
     fontSize:15,
     margin:10,
     color:'#000000',
      fontFamily: 'Museo 500',
 },
    button1: {
     padding:10,
     width:Dimensions.get('window').width/2.2,
    height:Dimensions.get('window').height/10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:25,
     borderColor:'#1c313a',
    
  },
   button2:{
     padding:10,
     width:Dimensions.get('window').width/2.2,
    height:Dimensions.get('window').height/10,  
    alignItems: 'center',
    backgroundColor: '#1c313a',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:25,
     borderColor:'#1c313a',
   
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
   

  },
   instructionBox:{
    left:'20%'
  }
});
