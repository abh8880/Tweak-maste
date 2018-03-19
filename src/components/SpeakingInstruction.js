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
import {Actions} from 'react-native-router-flux';
//import Ginger from 'ginger-correct';

export default class SpeakingInstruction extends Component {

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
  }
 
  
 

_sclear(){
  console.log("click me");
}

  render() {
  

    
    return (
      <View style={styles.container}>

        
      

      <View style={{ position: 'absolute', top: 0, marginTop:'5%',height: '5%',width:'50%', backgroundColor: '#003955',borderRadius:10, justifyContent: 'center'}}>



  
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
          
          Highest Score: 100
        </Text>
        </View>
    
  
    
    
     <ScrollView style={pstyles.scrollViewGR}
     showsVerticalScrollIndicator={true}>
    <View>
   
        <Text style={styles.intro}>You need to speak the word shown. Your grammar will be corrected , if applicable, as you speak. Press the START button to begin.</Text>
       
        </View>
     </ScrollView>
    

       

    <TouchableOpacity onPress={()=>Actions.speakingtabtwo()}>
     <View style={styles.clearButton}>
     <Text style={styles.clearText}>START</Text>
     </View>
    </TouchableOpacity>
    

    
      </View>
    
    
    );
  }
}

const pstyles = StyleSheet.create({
  scrollViewGR: {
    backgroundColor:'#ffffff',
    borderRadius:5,
    height: 30,
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