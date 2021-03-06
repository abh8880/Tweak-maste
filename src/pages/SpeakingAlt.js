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
  ToastAndroid
} from 'react-native';
import Modal from "react-native-modal";
import Voice from 'react-native-voice';
import Icon from 'react-native-vector-icons/FontAwesome';
//import Ginger from 'ginger-correct';

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
	  grammar: '',
	  sentences: [],
    isModalVisible: false
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
    
    var pitchStart = "", pitchEnd = "", pitchString = " Listening ";
    if(typeof this.state.pitch !== 'undefined') {
      var p = this.state.pitch;
      for(var i = 0; i < this.state.pitch; i++) {
          pitchStart += "|";
          pitchEnd += "|";
      }
    }
    

    pitchString = pitchStart + " Listening " + pitchEnd;

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
	  
      <View style={{position: 'absolute',  top: 0, marginTop:'5%',height: '5%',width:'50%', backgroundColor: '#003955',borderRadius:10, justifyContent: 'center'}}>

	
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
          
          { this.state.buttonStatus ? "Press the button and start speaking." : (pitchString)  }
        </Text>
        </View>

        <Text
          style={styles.stat}>
          {this.state.error.message}
        </Text>
		
		
        <Text
          style={styles.stat}>
          
        </Text>
        
		
      <ScrollView showsVerticalScrollIndicator={true} style={{flexGrow:0.01, height:40, marginBottom: 15,}}>
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
		
		
		 <ScrollView style={pstyles.scrollViewGR}
     showsVerticalScrollIndicator={true}>
    <View>
   
				{sentenceListRendered}
       
        </View>
		 </ScrollView>
		
    <TouchableOpacity onPress={()=>this._sclear()}>
	   <View style={styles.clearButton}>
     <Text style={styles.clearText}>CLEAR</Text>
     </View>
		</TouchableOpacity>
		<View style={{display:'none', position: 'absolute', left: 0, right: 0, bottom: 0, height: '10%', backgroundColor: '#840f06', justifyContent: 'center'}}><Text style={styles.innerkek}>{`Corrected Grammar: ${this.state.grammar}`}</Text></View>


		
      </View>
	  
	  
    );
  }
}

const pstyles = StyleSheet.create({
  scrollViewGR: {
    backgroundColor:'#ffffff',
    borderRadius:5,
    height: 15,
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