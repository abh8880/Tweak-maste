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
          Button,
          //Modal,
          ScrollView
        } from 'react-native';
        import { Card } from 'react-native-elements';
        import { Icon } from 'react-native-elements';
        import { StatusBar } from 'react-native';
        import Modal from "react-native-modal";

        import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
        import {SpeechToText} from 'react-native-watson';

        import GrammarView from '../components/GrammarView';
        import PronunciationView from '../components/PronunciationView';


        const StartStop = 0;

        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;


        export default class Speaking extends Component {
        state = {
        isModalVisible: false
      };

      _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

         constructor(props){
          super()

          this.state = {

           // modalVisible: false,
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
              SpeechToText.initialize("1b912ed6-a9a5-431e-8805-8ec6d9bcd8e6", "3QVmOMyFUp5d")

            return (
                
                    StatusBar.setHidden(true),
        
        <View style={styles.outerContainer}> 




          <View style={styles.grammarContainer}>

              
                       <View>
                
                        <TouchableOpacity onPress={this._onPressButton}>
                          <Text style={styles.moduleTitle}> Grammar Check </Text>
                        </TouchableOpacity>
                      </View> 
                
                       <TouchableOpacity onPress={this._toggleModal}>
                     <View style={styles.instructionButton}>
                  
                      <Text style={{
                          fontSize:15,
                          fontFamily:'Museo 500',
                          color:'#ffffff'}}>Instructions
                     </Text>
                   

                    <Modal isVisible={this.state.isModalVisible}
                      animationIn="slideInLeft"
                      animationOut="slideOutRight">
                          
                      <View style={styles.modalStyles}>

                        <View style={{flexDirection:'row'}}>
                            <View style={{width:'80%',alignItems:'center'}}>
                            <Text style={styles.moduleTitle}> Instructios</Text>
                            </View>

                            <View style={{width:'20%',alignItems:'center'}}>
                             <TouchableOpacity onPress={this._toggleModal}>
                             <Icon
                              name='close'
                              type='font-awesome'
                              color='#1c313a'
                            />
                            </TouchableOpacity>
                            </View>
                        </View> 
                        <View
                          style={{
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
 </TouchableOpacity>
                </View>
         




          <View style={styles.micContainer}>

            <TouchableOpacity onPressIn={this.onMicPress} onPressOut={this.onMicRelease}>
            <Image 
               style={{width: 120, height: 120}}
               source={require('../images/mic2.png')}
             />

            </TouchableOpacity>

          </View>

                
          <View style={styles.reportView}>

            <Text style={styles.ReportText}>Report:{this.state.answer}</Text>   

          </View>     


              <TabViewAnimated
                tabStyle={styles.tabStyle}
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

          outerContainer:{
              flex:1,
          },
         ReportText:{
            fontSize:20,
            fontFamily: 'sans-serif-condensed',
            color:'#1E434C',
            display:'none'
         },
         reportView:{
             width:Dimensions.get('window').width, 
             height: 30,
             alignItems:'flex-start',
             justifyContent:'center'
         },
        moduleTitle:{
            textAlign:'center',
            alignSelf:'center',
            fontSize:20,
            color:'#063852',
            marginTop:10,
            fontFamily: 'Museo 900'
         },
        grammarContainer:{
            width:Dimensions.get('window').width, 
            flex:0.5,

        },
        micContainer:{
            width:Dimensions.get('window').width, 
            height:Dimensions.get('window').height/3,
            alignItems:'center',
            justifyContent:'center',
            
        },
        startrecordContainer:{
            width: '80%', 
             height:Dimensions.get('window').height/15,
             margin:20,
            backgroundColor:'#41cbc7',
            borderRadius:5,
            justifyContent:'center',
            alignItems:'center',

        },
        modalStyles:{
            width:Dimensions.get('window').width/1.5,
            height:Dimensions.get('window').height/2, 
            alignItems:'center',
            backgroundColor:'white',
            alignSelf:'center'
        },
         innerModal:{
            marginTop:'20%'  
         },
         instructionButton:{
             backgroundColor:'#003955',
              width:Dimensions.get('window').width/3,
             height:Dimensions.get('window').height/15,
             alignItems:'center',
             alignSelf:'center',
             borderRadius:5,
             justifyContent:'center',
             marginTop:'10%'
             
         },
            tabStyle:{
                backgroundColor:'rgba(133,6,63,0.8)'
            }
        });