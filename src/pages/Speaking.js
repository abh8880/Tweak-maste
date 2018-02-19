/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {

  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,

} from 'react-native';


import { StatusBar } from 'react-native';


import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import {SpeechToText} from 'react-native-watson';

import GrammarView from '../components/GrammarView';
import PronunciationView from '../components/PronunciationView';


const StartStop = 0;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
 

export default class Speaking extends Component<{}> {

    constructor(props){
  super()

  this.state = {
    index: 0,
  sentencesSpoken: [],
    currentSentence: "",
    grammar: "",
  words: [],
    routes: [
      { key: '1', title: 'Pronunciation' },
      { key: '2', title: 'Grammar' },
    ],
    sentence: 'She only paints with bold colours; she does not like pastels',
    answer: "",
    color:'red',
    instruction: "Start Recording"
  };
 
   this.onSpeechButtonPress = this.onSpeechButtonPress.bind(this)
   this.onStopButtonPress = this.onStopButtonPress.bind(this)

    this.onMicRelease = this.onMicRelease.bind(this);
    this.onMicPress = this.onMicPress.bind(this);
}



    onMicPress = () => {
        this.onSpeechButtonPress();
    }
    
    onMicRelease = () => {
        this.onStopButtonPress();

    
    


    this.processGrammar();
    }
 

  processGrammar() {
    var ref = this;
    console.log("Processing grammar...");
    fetch('https://8xzzaark26.execute-api.ap-south-1.amazonaws.com/final?text=' + this.state.currentSentence, {
          method: 'GET',
          headers: {
          Accept: 'application/json',
            'Content-Type': 'application/json',
          },
    }).then((response) => {
      console.log("AWSREPONSE " + response._bodyText);
      var correctedSentence = response._bodyText.substr(1, response._bodyText.length - 2 );
      var toUpdate = ref.state.grammar + correctedSentence + ". ";
      console.log("SENTNCFORM " + toUpdate);
      this.setState({
        grammar: toUpdate
      });

      var sentenceTempArray = this.state.sentencesSpoken;
      sentenceTempArray.push(correctedSentence);
      this.setState({sentencesSpoken: sentenceTempArray});


    }).catch((error) => {
      console.error(error);
      this.setState({
        grammar: "Failed to connect to server!"
      });
    });
  }


  onSpeechButtonPress() {
    var ref = this;
    let sentenceText = ""
    if(this.state.instruction=='Start Recording') {

      SpeechToText.startStreaming((error, text) => {

        if(text) {
          console.log("Text",text)
          result = JSON.parse(text)
      
          word_confidence = result[0]['alternatives'][0]['word_confidence'];

          if(word_confidence) {

            var wordArray = this.state.words;
            wordArray.push(word_confidence);
            this.setState({words: word_confidence});

            this.setState({answer: ''});
            for (var i = 0; i < word_confidence.length; i++) {
              for (var j = 0; j < word_confidence[i].length; j++) {
                console.log('word_confidence[' + i + '][' + j + '] = ' + word_confidence[i][j]);
                pronounciation = word_confidence[i][j]
                if(j==1) {
                  pronounciation = word_confidence[i][j]*100;
                  if(pronounciation<50) { 
                    this.setState({color:'yellow'})  
                  }
                  else {
                    this.setState({color:'blue'})
                  }  
                } else {
                  sentenceText =  sentenceText + pronounciation + " ";
                }
                this.setState({answer: this.state.answer + ":" + pronounciation})
                

                console.log(this.state.answer); 
              }
            }
          }

          console.log("SENTENCE: " + sentenceText);
          this.setState({ currentSentence: sentenceText });


        }
        else {
          console.log("Error" + error);
        }
      });
      this.setState({instruction: 'Stop Recording'})
      console.log("Button Pressed");
    } else {
      SpeechToText.stopStreaming()
      this.setState({instruction: 'Start Recording'})
      console.log("stop")      
    }                
  };

  onStopButtonPress() {
    SpeechToText.stopStreaming()
    this.setState({instruction: 'Start Recording'})
    console.log("stop")  
  };
  
    answerStyle = () => {
     return {
      backgroundColor: this.state.color
    }
   }


  _handleIndexChange = index => this.setState({ index });
 
  _renderHeader = props => <TabBar {...props} />;
 
  
  getPronunciationData = () => {
    console.log("getPronunciationData");
    return this.state.answer;
  }
  
  getGrammarData = () => {
    console.log("getGrammarData");
    return this.state.grammar;
  }

  getSentencesSpoken = () => {
    return this.state.sentencesSpoken;
  }

   getWords = () => {
    return this.state.words;
  }

  _renderScene = ({ route }) => {
  switch (route.key) {
  case '1':
    return <PronunciationView answer={this.state.answer} getPronunciationData={this.getPronunciationData} getWords={this.getWords}/>;
  case '2':
    return <GrammarView grammar={this.state.grammar} getGrammarData={this.getGrammarData} getSentencesSpoken={this.getSentencesSpoken}/>;
  default:
    return null;
  }
  
}


  // render() {
  //   return (
  //     StatusBar.setHidden(true),
  //     <View style={styles.container}>
  //       <Text style={styles.welcome}>
  //        Speaking Skills
  //       </Text>
        
  //     </View>
  //   );
  // }

   render() {
    console.log("render")
      SpeechToText.initialize("1f340809-9ea9-4eaa-9404-83042e08f853", "IwxHoB67AAJE")

    return (
            StatusBar.setHidden(true),

<View style={{flex:1,flexDirection: 'column'}}> 
    
  <View style={{width:Dimensions.get('window').width, height: 50, backgroundColor: '#40c9c4'}}>
    
    <View style={{flex: 1, flexDirection: 'row'}}>


      <View style={{width:270}}>

        <TouchableOpacity onPress={this._onPressButton}>
          <Text style={{textAlign:'center',alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#063852',marginTop:10,fontFamily: 'sans-serif-condensed'}}> Grammar Check</Text>
        </TouchableOpacity>
      </View> 
    </View>
        
  </View>



  <View style={{width:Dimensions.get('window').width, height: 40,alignItems:'center',justifyContent:'center'}}>
    
    <Text style={{fontSize:20,fontFamily: 'sans-serif-condensed',fontWeight:'bold',color:'#1E434C'}}> Take a question</Text>   
       
  </View>     

  
  <View style={{width:Dimensions.get('window').width, height: 180, alignItems:'center',justifyContent:'center'}}>

    <TouchableOpacity onPressIn={this.onMicPress} onPressOut={this.onMicRelease}>
    <Image 
       style={{width: 120, height: 120}}
       source={require('../images/mic2.png')}
     />

    </TouchableOpacity>

  </View>
  <TouchableOpacity onPress={this.onSpeechButtonPress.bind(this)}> 
  <View style={{width: '80%', height: 45, marginLeft: '10%', backgroundColor:'#41cbc7',borderRadius:5,justifyContent:'center',alignItems:'center'}}>    
                             
    <Text style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
    {this.state.instruction}
    </Text>
    </View>
    </TouchableOpacity>

  
  <View style={{width:Dimensions.get('window').width, height: 30,alignItems:'flex-start',justifyContent:'center'}}>
    
    <Text style={{fontSize:20,fontFamily: 'sans-serif-condensed',color:'#1E434C', display:'none'}}>Report:{this.state.answer}</Text>   
       
  </View>     


      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />

</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  width: Dimensions.get('window').width,


  },
});