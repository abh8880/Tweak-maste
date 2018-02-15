import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as  Progress from 'react-native-progress'; // 3.4.0

import { Card } from 'react-native-elements'; // 0.18.5


import { TabNavigator,StackNavigator,DrawerNavigator } from 'react-navigation'; // 

var { height } = Dimensions.get('window');
var {width}=Dimensions.get('window').width;
var box_count = 3;
var box_height = height / box_count;

export default class VerticalStackLayout extends Component {
  render() {
    return (
    
        <View style={styles.Layout}>
     
   
      
        
         <View style={[styles.box, styles.box1]}>
            
                  
      
           <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Progress.Circle size={60} indeterminate={false} progress={0.4} />
           
            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
             <Text style={styles.welcome}>
            Course 1
            </Text>
            </View>
            <View  style={{margin:20}}>
             <Progress.Bar progress={0.6} height={8} unfilledColor={'rgba(154,154,154,1)'}width={150} borderWidth={0} borderRadius={0} />
            </View>
            </View>
            
            
        </View>
              <View style={styles.startButton}>
             <TouchableOpacity  onPress={() => Actions.first()} >
              <View style={styles.button}>
                <Text style={{ padding: 3, color:'#FFFFFF',fontWeight:'bold',fontSize:15}}>START</Text>
              </View>
            </TouchableOpacity>
            </View>

            </View>
            
        
     
      
      
     
         <View style={[styles.box, styles.box2]}>
           
           <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Progress.Circle size={60} indeterminate={false} progress={0.8} />

            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
             <Text style={styles.welcome}>
            Course 2
            </Text>
            </View>
            <View  style={{margin:20}}>
             <Progress.Bar progress={0.6} height={8} unfilledColor={'rgba(154,154,154,1)'}width={150} borderWidth={0} borderRadius={0} />
            </View>
            </View>
            
            
        </View>
              <View style={styles.startButton}>
              <TouchableOpacity  onPress={() => alert("Coming soon !")}>
              <View style={styles.button}>
                <Text style={{padding: 3, color:'#FFFFFF',fontWeight:'bold',fontSize:15 }}>START</Text>
              </View>
            </TouchableOpacity>
              </View>
            </View>
            
       
      
      
           
        </View>
      
    );
  }
}
const styles = StyleSheet.create({
  
  
  Layout: {
    flex:3,
    flexDirection: 'column',
    margin:10
     },
  box: {
   
    height: box_height
  },
  box1: {
    
    flex:1,
    borderRadius:10,
    margin:10,
    backgroundColor:'#e9e9e9',
     alignItems: 'center',
    justifyContent: 'center',
     height: 128,
    width:width
  },
  box2: {
     flex:1,
    borderRadius:10,
    margin:10,
    backgroundColor:'#e9e9e9',
     alignItems: 'center',
    justifyContent: 'center',
     height: 128,
    width:width
  },
  
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    justifyContent:'center',
    margin: 10,
    fontWeight: 'bold',
    color:'#002266',
   
  },
   card: {
    flex: 3,
     padding:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  innerContainer: {
    flex: 3,
    flexDirection: 'row'
  },
 innerBox: {
    height: box_height
  },
  innerBox1: {
    marginTop:70,
    marginLeft:20
    
  },
 innerBox2: {
    margin:20,
    justifyContent:'center',
    alignItems:'center'
  },
  button: {
    height: Dimensions.get('window').height / 15,
    width: 320,
    alignItems: 'center',
    borderRadius:10,
    backgroundColor:'#1c313a',
    margin:2,
    justifyContent:'center',
    alignItems:'center'
  },
  startButton: {
    width:width,

  }
});