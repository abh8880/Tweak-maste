import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Alert, BackHandler } from 'react-native';

import Result from './Result';
import Time_up from './Time_up';
import Select from './Select';
import * as Progress from 'react-native-progress';
import Modal from "react-native-modal";
import ModalView from './ModalView';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Actions} from 'react-native-router-flux';

var current_ans = '_____';
var ops = [];
var anspart = [];
var topic;
var chapter;
var id;
var time;
var status;
var timeout;
var timer = null;
var bar = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'})
export default class Activity1 extends Component {
  
  constructor(props) {
  time = new Array();
  super(props);
  
  this.state = {
    question : '',
    answer : '',
    current_ans: current_ans,
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
    isModalVisible: false,
  };

  topic = this.props.topic;
  chapter = this.props.chapter;
  

  db.transaction((tx) => {
      console.log("mode="+this.props.wrong);
       tx.executeSql('SELECT * FROM act1 WHERE chapter=? AND topic=? AND status=?', [chapter,topic,this.props.wrong], (tx, results) => {

       var len = results.rows.length;
       console.log("len="+len);

       if(len > 0){
        var rand = Math.floor(Math.random()*(len-1))+0;
        console.log("rand="+rand)
        var row = results.rows.item(rand);
        console.log("c="+row.correct);
        console.log("status="+row.status);
        this.setState({question: row.question});
        this.setState({answer: row.answer});
        this.setState({correct_ans: row.correct});
        ops.push(row.op1);
        ops.push(row.op2);
        ops.push(row.op3);
        ops.push(row.op4);
        this.setState({ops:ops});
        this.setState({id:row.id});

        if(len==1 && this.props.wrong == 0)
          this.setState({last:1});

        else if(len==1 && this.props.wrong == 2)
          this.setState({rem_rep:1})
      }
      
    });
    
    console.log("id="+id);

    });    
}

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
 
 
  _handleButtonPress = (ans) => {
    this.setState({ current_ans:ans });
  };


  _handleSubmitPress = () => {
    console.log(this.state.current_ans);
    console.log(this.state.correct_ans);

    if(this.state.current_ans === this.state.correct_ans){
      console.log("entered");

      this.setState({check_ans: 1});
      this.setState({repeat: 0});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act1 SET status=1 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("correct update");
        });
      
      });

    }

    else{
      this.setState({check_ans: 0});
      this.setState({repeat: 1});

      db.transaction((tx) => {
        tx.executeSql('UPDATE act1 SET status=2 WHERE id=?', [this.state.id], (tx, results) => {
          console.log("wrong update");
        });
      
      });
    }

    console.log(this.state.check_ans);
    //this.setState({status: 1});

    this.setState({isModalVisible:true});
      
    this.setState({question: ''});
    this.setState({current_ans: '_____'});
    
    
    ops = [];
    anspart = [];
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

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  _handleNextPress = () => {
    this.setState({ status:1 });
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
          timer = <View style={{flexDirection:'row'}}>
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
            <Progress.Bar progress={this.state.progress} width={Dimensions.get('window').width-80} height={8} unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'}/>
          </View>

    </View>;
    }

    else{
      bar =<View style={{flexDirection:'row'}}>

       <View style={{flex:0.3,margin:'2%'}}>
        <View >
        <TouchableOpacity onPress={this._show_alert}>
           <View style={ styles.instructionBox}>
              <Icon name="close" size={30} color="#000000" />
          </View>
        </TouchableOpacity>
      </View>
       </View>

       <View style={{flex:3,margin:'5%',alignItems:'center'}}>
        <Progress.Bar progress={this.state.bar/12} width={Dimensions.get('window').width-80} 
        height={8} unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'} animated={false}/>
    </View>

    </View>
    }

    anspart = this.state.answer.split('_');
      
    if(this.state.status == 0){
      return (
        

        <View style={styles.container}>
            {topic==-1 && timer}
            {topic!=-1 && bar}


            <View style={styles.questBox}>
             <Text style={{fontSize:20,fontFamily: 'Museo 500',marginLeft:'3%'}}>{this.state.question}</Text>
            </View>
            
            <View style={styles.ansBox}>
              <View style={styles.ansLine}>
                 <Text style={{fontSize:20,fontFamily: 'Museo 500'}}>{anspart[0]}</Text>
                <Text style={{fontSize:20, fontFamily: 'Museo 500'}}>{this.state.current_ans}</Text>
               

              </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:20,fontFamily: 'Museo 500'}}>{anspart[1]}</Text>
            </View>
            </View>
          
          
            <Card>
            <View style={styles.opsBox}>
              
              <View style={styles.buttonLine}>
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
              </View>
              
              <View style={styles.buttonLine}>
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
              </View>
                            
            </View>
            </Card>
           <View style={styles.subBox2}>
                    <TouchableOpacity onPress={() => this._handleSubmitPress()}>
                          <View style={styles.button2}>
                        <Text style={{fontSize:20,fontFamily: 'Museo 500', color:'#ffffff'}}>SUBMIT</Text>
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
        //<Result score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
        <Select score={this.state.check_ans} topic={topic} chapter={chapter} end={this.state.last} repeat={this.state.repeat} rem_rep={this.state.rem_rep}/>
      );
    }

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
  },
  
  
  ansBox: {
   flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ansLine: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  
  opsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'stretch',
    borderRadius:5
  },
  
  subBox2: {
   
     flex:2,
     alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  button2:{
     padding:10,
     width:Dimensions.get('window').width/2.5,
    height:Dimensions.get('window').height/10,  
    alignItems: 'center',
    backgroundColor: 'pink',
    justifyContent:'center',
    borderWidth:2,
     borderRadius:10,
     borderColor:'black',
   
   },
  buttonLine: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    justifyContent: 'center',
    
  },
  
  button: {
    margin:20,
    width:120,
    alignItems: 'center',
    backgroundColor: '#1c313a',
    borderRadius: 10
  },
  
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 18,
    fontFamily: 'Museo 500',
  },
  titleQuestion:{
     justifyContent:'center',
     fontSize:22,
     fontFamily: 'Museo 500',
     padding:10,
     marginLeft:9,
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
