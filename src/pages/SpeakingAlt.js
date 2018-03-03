import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AppRegistry,
  TouchableHighlight,
  Dimensions,
  ScrollView
} from 'react-native';

import Voice from 'react-native-voice';
//import Ginger from 'ginger-correct';

export default class Speaking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
	  grammar: '',
	  sentences: []
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
      end: '√',
    });
	
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
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
	  
	  <View style={{position: 'absolute', left: 0, right: 0, top: 0, height: '10%', backgroundColor: '#840f06', justifyContent: 'center'}}><Text style={styles.innerkek}>Tweak _module voice_recog_grammar</Text></View>

	  
	  
       <View>
        <Text style={styles.instructions}>
          Press the button and start speaking.
        </Text>
        </View>

        <Text
          style={styles.stat}>
          {this.state.error.message}
        </Text>
		
		
        <Text
          style={styles.stat}>
          
        </Text>
        
		
        <Text
          style={styles.stat}>
          {this.state.results[0]}
        </Text>
        {this.state.partialResults.map((result, index) => {
          return (
            <Text
              key={`partial-result-${index}`}
              style={styles.stat}>
              {result}
            </Text>
          )
        })}
		
		
	
        <TouchableHighlight onPress={this._startRecognizing.bind(this)}>
          <Image
            style={styles.button}
            source={require('../images/mic3.png')}
          />
        </TouchableHighlight>
        
		
		
		 <ScrollView style={pstyles.grammarView}
     showsVerticalScrollIndicator={true}>
    <View>
   
				{sentenceListRendered}
       
        </View>
		 </ScrollView>
		
	
		
		<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '10%', backgroundColor: '#840f06', justifyContent: 'center'}}><Text style={styles.innerkek}>{`Corrected Grammar: ${this.state.grammar}`}</Text></View>


		
      </View>
	  
	  
    );
  }
}

const pstyles = StyleSheet.create({
    grammarView: {
		margin: 20,
    padding: 40,
    backgroundColor:'#e5e5e5',
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
  },
  container: {
    flex: 1,
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
  }
});

//AppRegistry.registerComponent('VoiceTest', () => VoiceTest);