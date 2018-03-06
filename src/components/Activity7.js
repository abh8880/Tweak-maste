import React, { Component } from 'react';
import { Text, View, TouchableOpacity,TouchableHighlight, StyleSheet,Dimensions, Alert, BackHandler } from 'react-native';
import Result from './Result';
import Select from './Select';
import Time_up from './Time_up';
import ModalView from './ModalView';
import Modal from "react-native-modal";
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import {Actions} from 'react-native-router-flux';

var sentence = new Array();

sentence = '';

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
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'})
var timer = null;
var timeout;

export default class Activity7 extends Component {
    

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
      progress:1,
      bar:0,
      isModalVisible:false,
    };


    topic = this.props.topic;
    chapter = this.props.chapter;
    
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM act7 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var length = results.rows.length;

       // console.log("DB:"+length);

       if(length > 0){
        var rand = Math.floor(Math.random()*(length-1))+0;
        // console.log("rand="+rand)
        var row = results.rows.item(rand);
        this.setState({sentence: row.sentence});
        // console.log(this.state.sentence);
        words = row.sentence.split(" ");
        // console.log(this.state.words);
        this.setState({words:words});
        len = words.length;
        this.setState({len:len});

        correct_ans = row.correct;
        // console.log("correct ans " + correct_ans);
        this.setState({correct_ans:correct_ans});
        this.setState({id:row.id});
        if(len==1 && this.props.wrong == 0)
          this.setState({last:7});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:7})

       }
          
        });
    });

  }

  componentWillMount(){
    // console.log("prop count:"+this.props.count);
  this.setState({bar:this.props.count});
  // console.log("recieved "+topic+chapter);
  // console.log("bar state "+this.state.bar);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  _handleButtonPress = index => {
  	if (!pressed[index]){
  		pressed[index] = true;
    	answer = words[index];
    	this.setState({ answer: answer});
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
    answer = " ";
    this.setState({ answer: answer });
  };
  
   _handleSubmitPress = () => {
    // console.log("my answer "+this.state.answer);
    // console.log("correct answer "+this.state.correct_ans);

    var answer = this.state.answer;
    
    if(answer.charAt(answer.length-1).toUpperCase().toLowerCase() == answer.charAt(answer.length-1).toUpperCase()){
      // console.log("last letter="+answer.charAt(answer.length-1));
      answer = answer.substring(0,answer.length-1);
    }

    // console.log("final answer="+answer);

    if(answer === this.state.correct_ans){
      // console.log("entered");
        
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

    // console.log(this.state.check_ans);
    this.setState({isModalVisible: true});        

    this.setState({question: ''});
    this.setState({current_ans: '_____'});
    

  };
  

  update2 = () =>{
    db.transaction((tx) => {
    tx.executeSql('UPDATE act7 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
    
    });
  
  });
  };

  _handleNextPress(){
    this.setState({status:1});
  }
  
  render() {

    if(topic == -1){
      clearTimeout(timeout);

      timeout = setTimeout((function() {
        this.setState({ progress: this.state.progress - 0.1});
      }).bind(this), 1000);
  
      // console.log("progress="+this.state.progress);
  
      if(this.state.progress<0){
        // console.log("less");
        clearTimeout(timeout);
        this.update2();
        return(
          <Time_up topic={topic} chapter={chapter} end={this.state.last}/> 
        );
      }
  
    }


    if (topic == -1) 
    {
          timer =<View style={{flexDirection:'row'}}>
       <View style={{flex:0.3,margin:'2%'}}>
        <View >
        <TouchableOpacity onPress={this._show_alert}>
           <View style={ styles.instructionBox}>
              <Icon name="close" size={30} color="#000000" />
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
              <Icon name="close" size={30} color="#000000" />
          </View>
        </TouchableOpacity>
      </View>
       </View>

          <View style={{flex:3,margin:'5%',alignItems:'center',}}>
        <Progress.Bar progress={this.state.bar/12} width={Dimensions.get('window').width-80} height={8} unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'} animated={false}/>
         </View>
    </View>
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
            {topic!=-1 && bar}        
          
        <View style={{flex:2}}>
          <Text style={styles.titleQuestion}>
            Click the word that makes the sentence sound wrong.
          </Text>
        </View>        
       <View style={styles.compBox}>
      			<Text style={{fontSize:15,color:'black', fontFamily: 'Museo 500',}}>Wrong Sentence:</Text>
                           <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        { buttons1 }
                        </View>
      		</View>
    
        
        <View style={styles.opsBox} >
        <Text style={{fontSize:15,color:'black', fontFamily: 'Museo 500',}}>Wrong Word:</Text>
       <Text style={{fontSize:20}}>
            {answer}
          </Text>
        </View>
        <View style={{flex: 3, flexDirection: 'row'}}>
              <View style={styles.subBox1}>
              <TouchableOpacity onPress={() => this._clear()}>
                  <View style={styles.button1}>
                <Text style={{fontSize:20, fontFamily: 'Museo 500',color:'#1c313a'}}>CLEAR</Text>
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

           
             <Modal isVisible={this.state.isModalVisible}
              animationIn="slideInLeft"
              animationOut="slideOutRight">
             <View style={styles.modalContent}>
             <ModalView correct={this.state.correct_ans} score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
             <TouchableOpacity style={{width:'100%'}} onPress={() => this._handleNextPress()}>
              <View style={{alignItems: 'center',justifyContent: 'center',backgroundColor: '#1c313a',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                   
                      <View style={styles.buttonM}>
                        <Text style={{fontSize:20,color:'#ffffff',fontFamily:'Museo 500'}}>NEXT</Text>
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
        // console.log("rep_state="+this.state.repeat);
          // console.log("rem_rep_state="+this.state.rem_rep);
          return(
            <Select score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
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
    backgroundColor: '#1c313a',
  },
  buttonText: {
    padding: 5,
    color:'black',
    fontSize: 20,
     fontFamily: 'Museo 500',
  },
    opsBox: {
    flex: 2,
    alignItems:'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  hint: {
    padding: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
  },
  supBox: {
    flex: 4,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
  },
  compBox: {
    flex: 2,
    alignSelf: 'stretch',
    alignItems:'center',
    backgroundColor: '#ffffff',
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
  },
  grid: {
  	padding: 10,
    flexWrap: 'wrap',
     backgroundColor:'#ffffff'
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
    backgroundColor: 'orange',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:10,
     borderColor:'#1c313a',
   
   },
   titleQuestion:{
     justifyContent:'center',
     fontSize:15,
     fontFamily: 'Museo 500',
     margin:20,
     color:'#000000'
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
