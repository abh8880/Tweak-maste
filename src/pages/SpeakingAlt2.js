import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AppRegistry,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ProgressBar
} from 'react-native';
import Modal from "react-native-modal";
import Voice from 'react-native-voice';
import Icon from 'react-native-vector-icons/FontAwesome';
//import Ginger from 'ginger-correct';
import ProgressBarClassic from 'react-native-progress-bar-classic';

export default class Speaking extends Component {

     state = {
    isModalVisible: false
  };

_toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  
  constructor(props) {
    super(props);
    this.state = {
      buttonStatus: 1,
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      score: 0,
      grammar: '',
      sentences: [],
      isModalVisible: false,
      currentQuestionIndex: 0,
      timeLeft: 30.0,
      question: ['apple','horse','house','school', 'young', 'world', 'week'],
      chatMessages: [{ text: "Hey there!", type: 0 }]
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
	
	//this.ginger = new Ginger();
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    clearImmediate(this._interval);
  }

  componentDidMount() {
 
    
  this.tryagain();
}

  generateNewBotMessage() {
    var next = Math.floor(Math.random() * this.state.question.length);
    this.setState({currentQuestionIndex: next });
    this.makeMessage("Make a sentence with the word '" + this.state.question[next] + "'!", 0);
  }

  makeMessage(message, mtype) {
    var chatMessagesArray = this.state.chatMessages;
    chatMessagesArray.push({ text: message, type: mtype});
    this.setState({ chatMessages: chatMessagesArray });
     //this.refs.scrollView.scrollToEnd();
  }

  tryagain() {

    this.generateNewBotMessage();   
    this.setState({ timeLeft: 30 });
    this.setState({ score: 0 });
    this._interval = setInterval(() => {
      //console.log("happen")
      this.setState({ timeLeft: this.state.timeLeft - 0.050 });
      if(this.state.timeLeft <= 0) {
        this.setState({ timeLeft: 0 });
        clearImmediate(this._interval);
        this.makeMessage("Game Over! Score: " + this.state.score, 0);
      } 
    
    }, 50);
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
       buttonStatus: 1,
      end: '√',
    });
	
  }

  onSpeechError(e) {
    this.setState({
       buttonStatus: 1,
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    
   
    ToastAndroid.show('Recording has Ended', ToastAndroid.SHORT);
    this.setState({
       buttonStatus: 1,
      results: e.value,
	  grammar: 'Loading...'
    });
	
	var ref = this;
  var currentQuestion = this.state.question[this.state.currentQuestionIndex];

  this.makeMessage(e.value[0], 1);

  if(!(e.value[0].toLowerCase().indexOf(currentQuestion.toLowerCase()) >= 0)) {
    //this.setState({ partialResults: ["The word '" + currentQuestion + "' wasn't found in your sentence! Please try again!"]})
    this.makeMessage("The word '" + currentQuestion + "' wasn't found in your sentence! Please try again!", 0);
    return;
  }
	
	fetch('https://8xzzaark26.execute-api.ap-south-1.amazonaws.com/final?text=' + e.value[0], {
	  method: 'GET',
	  headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	  },
	}).then((response) => {
		ref.setState({
		  grammar: response._bodyText
		});
		var correctedSentence = response._bodyText.substr(1, response._bodyText.length - 2 );


    if(correctedSentence.toLowerCase().localeCompare(e.value[0].toLowerCase()) == 0) {
      ref.setState({timeLeft: ref.state.timeLeft + 5});
      var sentenceLength = correctedSentence.split(' ').length;
      var scoreToGive = ref.state.score + 1 + (sentenceLength > 4 ? 3 : 0);
      ref.setState({score: scoreToGive });
       //ref.setState({ partialResults: ["Correct answer! +1 points and +5 seconds!"]});
       ref.makeMessage("Correct answer! " + scoreToGive + " points and +5 seconds!", 0);
       

    } else {
      ref.setState({timeLeft: ref.state.timeLeft - 5});
       
       
       //ref.setState({ partialResults: ["Wrong answer! -5 seconds!"]})
       ref.makeMessage("Wrong answer! -5 seconds!", 0);
       ref.makeMessage("The corrected sentence is: " + correctedSentence, 0);
    }

    //var next = Math.floor(Math.random() * ref.state.question.length);
     // ref.setState({currentQuestionIndex: next });
      //console.log(next);
      ref.generateNewBotMessage();

		var sentenceTempArray = ref.state.sentences;
              sentenceTempArray.push(correctedSentence);
              ref.setState({sentences: sentenceTempArray});
			  
	}).catch((error) => {
      console.error(error);
	  ref.setState({
		  grammar: "Failed to connect to server!"
		});
    });
	
	
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value,
    });
  }

  async _startRecognizing(e) {
    this.setState({
      buttonStatus: 0,
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
	  grammar: ''
    });
    try {
      await Voice.start('en-US');
      ToastAndroid.show('Rcording has Started', ToastAndroid.SHORT);
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

_sclear(){
  this.setState({sentences:[]});
}
  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
	  grammar: '',
	  sentences: []
    });
  }

  render() {




    //var sentencetemparray = this.state.sentences;
    //sentencetemparray.push(this.state.question[this.state.currentQuestionIndex]);
    //this.setState({sentences: sentencetemparray});
    
    var pitchStart = "", pitchEnd = "", pitchString = " Listening ";
    if(typeof this.state.pitch !== 'undefined') {
      var p = this.state.pitch;
      for(var i = 0; i < this.state.pitch; i++) {
          pitchStart += "|";
          pitchEnd += "|";
      }
    }
    

    pitchString = pitchStart + " Listening " + pitchEnd;


    var chatMessages = this.state.chatMessages;
		var chatListRendered = chatMessages.map(function(name){
			return <Text style={name.type == 0 ? pstyles.chatBotTextView : pstyles.chatUserTextView} key={name+Math.random()}>{name.text}</Text>;
        })


	  var sentences = this.state.sentences;
		var sentenceListRendered = sentences.map(function(name){
			return <Text style={pstyles.sentenceTextView} key={name+Math.random()}>{name}.</Text>;
        })


		let renderDiv = <Text style={styles.intro}>Your grammar will be corrected here, if applicable, as you speak. Press the mic button to begin.</Text>;
		if(sentences.length < 1) {
			sentenceListRendered = renderDiv;
		}
    return (
      <View style={styles.container}>
	  
      
         <View style={{position: 'absolute', top: 5, width:'90%', justifyContent: 'center'}}>
           
          <ProgressBarClassic progress={(this.state.timeLeft/30)*100}  valueStyle={'none'} />
           </View>
      <View style={{position: 'absolute',  top: 0, marginTop:'8%',height: '5%',width:'50%', backgroundColor: '#003955',borderRadius:10, justifyContent: 'center'}}>

	
      <View >
    
        <TouchableOpacity onPress={this._toggleModal}>
           <View style={ styles.instructionBox}>
          <Text style={styles.showtext}>INSTRUCTIONS</Text>
          </View>
          
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}
         animationIn="slideInLeft"
          animationOut="slideOutRight">
          <View style={styles.modalStyles}>
           
           
                <View style={{flexDirection:'row'}}>
                <View style={{flex:3,alignItems:'center',marginTop:'2%'}}>
                <TouchableOpacity onPress={this._toggleModal}>
                  <Text style={styles.InstText}>Instructions</Text>
                </TouchableOpacity>
                </View>

                <View style={{flex:0.5,alignItems:'center'}}>
                <TouchableOpacity onPress={this._toggleModal}>
                 <Icon name="close" size={25} color="#900" />
                </TouchableOpacity>
                </View>

            </View>
             <View style={{
                            width:Dimensions.get('window').width/1.5,
                            borderBottomColor: '#D3D3D3',
                            borderBottomWidth: 1,
                          }}
                        />
          
                        <View style={styles.innerModal}>
                         <Text> Step 1: </Text>
                         <Text> Step 1: </Text>
                         <Text> Step 1: </Text>
                         <Text> Step 1: </Text>
                        </View>
          </View>
        </Modal>
      </View>
      </View>

       <View>
         
        <Text style={styles.instructions}>
          Score: {this.state.score}{"\n"} Time Left: {this.state.timeLeft.toFixed(0)} seconds{"\n"}
        </Text>
          
        </View>


       {/*<View>
        <Text style={styles.instructions}>
          
          { this.state.buttonStatus ? "Press the button and start speaking." : (pitchString)  }
        </Text>
        </View>*/}

        <Text
          style={styles.stat}>
          {this.state.error.message}
        </Text>
		
		
        <Text
          style={styles.stat}>
        </Text>
        
		
      <ScrollView showsVerticalScrollIndicator={true} style={{flexGrow:0.01, height:50, marginBottom: 0,}}>
        {this.state.partialResults.map((result, index) => {
          return (
            <Text
              key={`partial-result-${index}`}
              style={styles.stat}>
              {result}
            </Text>
          )
        })}
		</ScrollView>
		
	  <ScrollView ref="scrollView" style={pstyles.scrollViewChat}  onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({y:height})}
     showsVerticalScrollIndicator={true}>
    <View>
   
				{chatListRendered}
        
        </View>
		 </ScrollView>  

     { this.state.timeLeft <= 0 && 
     
      <TouchableOpacity onPress={()=>this.tryagain()}>
        <View style={styles.clearButton}>
        <Text style={styles.clearText}>Try again</Text>
        </View>
        </TouchableOpacity>
        }


    { this.state.timeLeft > 0 && 
      <View >
        <TouchableHighlight onPress={this._startRecognizing.bind(this)}>
          <Image
            style={this.state.buttonStatus ? styles.button : styles.button2}
            source={require('../images/mic2.png')}
          />
        </TouchableHighlight>
        <Image
            style={!this.state.buttonStatus ? styles.button : styles.button2}
            source={require('../images/mic3.png')}
          />
          </View>
    }

		
      </View>
	  
	  
    );
  }
}

/*
<TouchableOpacity onPress={()=>this._sclear()}>
	   <View style={styles.clearButton}>
     <Text style={styles.clearText}>CLEAR</Text>
     </View>
		</TouchableOpacity>
		<View style={{display:'none', position: 'absolute', left: 0, right: 0, bottom: 0, height: '10%', backgroundColor: '#840f06', justifyContent: 'center'}}><Text style={styles.innerkek}>{`Corrected Grammar: ${this.state.grammar}`}</Text></View>

*/

const pstyles = StyleSheet.create({
  scrollViewChat: {
    borderRadius:5,
    height: 100,
    width:'90%',
   flexGrow:0.5
    },
  scrollViewGR: {
    backgroundColor:'#ffffff',
    borderRadius:5,
    height: 100,
    margin:'5%',
   flexGrow:0.5
    },
    grammarView: {
    backgroundColor:'#ffffff',
    borderRadius:5,
    flexGrow:0.5,
    margin:'5%',
   
    },
	sentenceTextView: {
		backgroundColor: '#72ccf9',
		color: 'white',
		margin: 2,
		padding: 4,
		borderRadius:5,
	},
  chatBotTextView: {
		backgroundColor: '#ece5dd',
		color: 'orange',
    margin:2,
		marginRight: '50%',
		padding: 4,
		borderTopRightRadius:5,
    borderBottomRightRadius:5,
    borderBottomLeftRadius:5,
	},
  chatUserTextView: {
		backgroundColor: '#dcf8c6',
		color: 'green',
    margin:2,
		marginLeft: '50%',
		padding: 4,
		borderTopLeftRadius:5,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
	}
});

const styles = StyleSheet.create({
  button: {
    width:Dimensions.get('window').width/3,
    height:Dimensions.get('window').height/5,
    backgroundColor:'#F5FCFF'
  },button2: {
    display:'none'
  },
  container: {
    flex: 1,
    padding:0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    fontFamily:'Museo 500',
    textAlign: 'center',
    margin: 10,
    backgroundColor:'red'

  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontFamily:'Museo 500',
  },
  instructions: {
     fontSize: 18,
    fontFamily:'Museo 500',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginTop: 35
  },
  stat: {
     fontSize: 18,
    fontFamily:'Museo 500',
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  kek: {
	backgroundColor: '#6cba00',
	width: '100%',
	height: '10%',
    textAlign: 'center',
    color: 'white',
    marginBottom: 1
  },
  innerkek: {
    textAlign: 'center',
    color: 'white',
    margin: 1,
    fontFamily:'Museo 700',
    fontSize:18
  },
  intro:{
    fontSize:15,
    fontFamily:'Museo 500',
    color:'black',
  },
  modalContent:{
     backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
   

  },
  instructionBox:{
    alignItems:'center',
      },

  clearButton:{
    backgroundColor:'white',
    borderWidth:2,
    borderColor:'#000000',
    width:Dimensions.get('window').width/4,
    height:Dimensions.get('window').height/16,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5
  },
  InstText:{
    fontSize:20,
    color:'#1c313a',
    fontFamily:'Museo 700'
  },
  showtext:{
    fontSize:15,
    fontFamily:'Museo 500',
    color:'#ffffff'
  },

   modalStyles:{
            width:Dimensions.get('window').width/1.5,
            height:Dimensions.get('window').height/2.5, 
            alignItems:'center',
            backgroundColor:'white',
            alignSelf:'center'
        },

  clearText:{
    fontFamily:'Museo 500',
    fontSize:20,
    color:'black'
  }

});

//AppRegistry.registerComponent('VoiceTest', () => VoiceTest);