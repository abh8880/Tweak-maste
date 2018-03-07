import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  BackHandler,
  Alert
} from 'react-native';

import { StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as  Progress from 'react-native-progress'; // 3.4.0

import { Card } from 'react-native-elements'; // 0.18.5


import { TabNavigator,StackNavigator,DrawerNavigator } from 'react-navigation'; //

var { height } = Dimensions.get('window').height;
var {width}=Dimensions.get('window').width;
var box_count = 3;
var box_height = height / box_count;

export default class VerticalStackLayout extends Component {
  
  async get(){
    username = await AsyncStorage.getItem('username');
    console.log("in courses.js , name: "+username)
    alert(username);
    this.setState({username:username});
    console.log("state: "+this.state.username)
  }

   constructor(props) {
        super(props);
        this.state = {
          username: ''
        };
        this.get();

      };

    componentDidMount() {
      this.get();
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
  
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
  
    handleBackButton = () =>{
      Alert.alert(
        'Hello !',
        'Do you really want to exit the app?',
        [
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
          {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: true }
      )
      return true;
    }



  render() {
    return (

        <View style={styles.Layout}>
     <View style={styles.box1}>


         <TouchableOpacity onPress={() => Actions.first({username:username})} >


           <View  style={{alignItems:'center',padding:10}}>
             <Text style={styles.cardTitle}>Grammar</Text>
             </View>

            <View
              style={{
                borderTopColor: '#D3D3D3',
                borderTopWidth: 1,
                flex:0.5
              }}
            />


           <View style={styles.innerContainer}>

           <View style={styles.innerBox1}>
              <Image
                  //source={require('../../icons/12.png')}
                  style={{width: '50%', height: '50%', top:'5%',}}
                />

            </View>
            <View style={styles.innerBox2}>
              <View  style={styles.caption}>
               <Text style={styles.captionText}>Master the art of perfect </Text>
                 <Text style={styles.captionText}>Sentence Formation</Text>
              </View>
            <View style={styles.progress}>
              <Progress.Bar progress={0.6} height={8}  color={'rgba(28, 49, 58, 1)'} unfilledColor={'rgba(154,154,154,1)'}width={150} borderWidth={0} borderRadius={0} />
            </View>
            </View>

        </View>

              <View style={styles.startButton}>


                   <View style={styles.button2}>
                    <Text style={{ padding: 3, color:'#FFFFFF', fontFamily:'Museo 700',fontSize:15,}}>Let's Go!</Text>
                  </View>
             </View>
            </TouchableOpacity>
            </View>




              { /*box 1 ends here*/ }

         <View style={styles.box2}>

         <TouchableOpacity  onPress={() => Actions.vocabHome()}>


           <View  style={{alignItems:'center',padding:10}}>
              <Text style={styles.cardTitle}>Vocabulary</Text>
             </View>
            <View
              style={{
                borderTopColor: '#D3D3D3',
                borderTopWidth: 1,
                flex:0.5
                
              }}
            />


           <View style={styles.innerContainer}>

            <View style={styles.innerBox1}>
              <Image
                  source={require('../../icons/6.png')}
                  style={{width: '50%', height: '50%', top:'5%'}}
                />

            </View>
            <View style={styles.innerBox2}>
              <View  style={styles.caption}>
               <Text style={styles.captionText}>Improve your Vocabulary</Text>
                 <Text style={styles.captionText}>knowing the origin of words</Text>
              </View>
            <View style={styles.progress}>
              <Progress.Bar progress={0.6} height={8}  color={'rgba(28, 49, 58, 1)'} unfilledColor={'rgba(154,154,154,1)'}width={150} borderWidth={0} borderRadius={0} />
            </View>
            </View>


        </View>

              <View style={styles.startButton}>


            <View style={styles.button2}>
                <Text style={{ padding: 3, color:'#FFFFFF', fontFamily:'Museo 700',fontSize:15,}}>Let's Go!</Text>
              </View>

            </View>
            </TouchableOpacity>
            </View>




        </View>


    );
  }
}
const styles = StyleSheet.create({


  Layout: {
    flex:1,
    flexDirection: 'column',
    margin:10
     },
  box: {

    height: box_height
  },
  box1: {

    flex:5,
    margin:10,
    backgroundColor:'#ffffff',
   alignItems: 'center',
    justifyContent: 'center',
    width:width,

  },
     box2: {
     flex:5,
    margin:10,
    backgroundColor:'#ffffff',
   alignItems: 'center',
    justifyContent: 'center',
    width:width,

  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    justifyContent:'center',
    margin: 10,
    fontWeight: 'bold',
    color:'#1c313a',

  },

  innerContainer: {
    flex: 3,
    flexDirection: 'row',
    marginBottom:10,
    backgroundColor:'white'
  },
 
  innerBox1: {
   alignItems:'center',
   left:'5%',
    backgroundColor:'pink',
    width:'35%'
  },
 innerBox2: {
       alignItems:'center',
        backgroundColor:'green',
       width:'65%'
  },
  caption: {
    margin:10,
     right:'2%',
     flexWrap: 'wrap',
    backgroundColor:'white'

  },
  button2: {
    height: Dimensions.get('window').height / 15,
    width: Dimensions.get('window').height-250,
    alignItems: 'center',
    backgroundColor:'#1c313a',
    justifyContent:'center',
    alignItems:'center'

  },
  startButton: {
    width:width,
    flex:1

  },
cardTitle:{

    color:'black',
    fontSize:18,
     fontFamily: 'Museo 700',
    marginBottom:5,
   justifyContent:'center'
},
captionText:{
    paddingBottom: 3,
    color:'#af0c56',
    fontSize:15,
    fontFamily: 'Museo 700'
},
progress:{
  
}
});
