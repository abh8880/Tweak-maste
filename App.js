import React, { Component } from 'react';
import {View, StyleSheet, KeyboardAvoidingView,ImageBackground, Button} from 'react-native';
import { CheckBox } from 'react-native-elements';

// You can import from local files
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import StartPage from './src/pages/StartPage';
import { StackNavigator } from 'react-navigation';


export default class Home extends Component {
  render() {
    return (
          
            <KeyboardAvoidingView behavior = "padding" style={styles.KeyboardContainer}>
     		<Screens/>
            </KeyboardAvoidingView>
      
    );
  }
}




const styles = StyleSheet.create({
  KeyboardContainer: {
    flex: 1,
    justifyContent: 'center'
  },
   
});


const Screens = StackNavigator({
   Login:{screen:Login
   		},    
  Signup:{ screen: Signup,
         },
  StartPage:{ screen: StartPage,
         },
},
);