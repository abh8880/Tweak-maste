import React, { Component } from 'react';
import {
   StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

import { Card } from 'react-native-elements'; // 0.18.5

import {Actions} from 'react-native-router-flux';

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;

export default class First extends Component {
  
 static navigationOptions = {
    title: '⌘  Home',
    headerStyle: {
      backgroundColor: '#00232d',
    },
    headerTitleStyle: {
      color: '#88bfff',
      fontSize: 20,
      fontWeight: '300'
    }
  };

  constructor(props) {
        super(props);  
  };


  render() {
    console.log("rendered");

    
    return (
        
        <View style={styles.Layout}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
          <View style={styles.card}>
      
        <Card>
         <View style={[styles.box,styles.box1]}>
             <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Image
                  source={require('../../assets/1_resized.png')}
                />
            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
            <Text style={styles.welcome}>
              Grammar
            </Text>
           </View>
           
            </View>
              
        </View>
        
             <View style={styles.start}>
             <TouchableOpacity  onPress={() => Actions.first()}>
             
                <Text style={{color:'#800000',fontWeight:'bold',fontSize:15}}>START</Text>

            </TouchableOpacity>
            </View>
   
            </View>
            
        </Card>
      </View>

      <View style={styles.card}>
      
        <Card>
         <View style={[styles.box,styles.box1]}>
             <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Image
                  source={require('../../assets/1_resized.png')}
                />
            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
            <Text style={styles.welcome}>
              Vocabulary
            </Text>
           </View>
           
            </View>
              
        </View>
        
             <View style={styles.start}>
             <TouchableOpacity  onPress={() => alert("Coming soon !")}>
             
                <Text style={{color:'#800000',fontWeight:'bold',fontSize:15}}>START</Text>

            </TouchableOpacity>
            </View>
   
            </View>
            
        </Card>
      </View>


      <View style={styles.card}>
      
        <Card>
         <View style={[styles.box,styles.box1]}>
             <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Image
                  source={require('../../assets/1_resized.png')}
                />
            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
            <Text style={styles.welcome}>
              Pronunciation
            </Text>
           </View>
           
            </View>
              
        </View>
        
             <View style={styles.start}>
             <TouchableOpacity  onPress={() => alert("Coming soon !")}>

                <Text style={{color:'#800000',fontWeight:'bold',fontSize:15}}>START</Text>

            </TouchableOpacity>
            </View>
   
            </View>
            
        </Card>
      </View>


          </ScrollView>
        </View>
   
      
    );
  }
}


const styles = StyleSheet.create({
  
  
  Layout: {
    flex:1,
    flexDirection: 'column',
  
    
  },
  
  box1: {
  
    borderRadius:10,
    margin:10,
     alignItems: 'center',
    justifyContent: 'center',
     height: 128,
    width: 280,
  },
  box2: {
  
    borderRadius:10,
    margin:10,
     alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    width: 280,
  },
   box3: {
  
    borderRadius:10,
    margin:10,
     alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    width: 280,
  },
     box4: {
     borderRadius:10,
    margin:10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    width: 280,
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    justifyContent:'center',
    fontWeight: 'bold',
    color:'#002266',
   
  },
   card: {
   
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
       
    
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  innerBox1: {
    margin:5
    
  },
 innerBox2: {
    margin:30,
    flexDirection:'column'
  },
  button: {
    margin: 10,
    height: Dimensions.get('window').height / 20,
    width: Dimensions.get('window').width / 4,
    alignItems: 'center',
    borderRadius:10
  },
    start:{
        marginTop:20,
        alignItems: 'center',
    }
});