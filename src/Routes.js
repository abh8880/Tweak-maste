import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  
} from 'react-native';

import Login from './pages/Login';
import Signup from './pages/Signup';
import First from './components/First';
import Lesson from './components/Lesson';
import Courses from './pages/Courses';
import Speaking from './pages/Speaking';

import { StackNavigator } from 'react-navigation';

const TabIcon =({selected, title})=> {
  return(
    <Text style= {{fontSize:100}}
    >{title}</Text>
    );
};

export default class Routes extends Component<{}> {
  render() {
    return(
      <Router>
          <Stack key="root" hideNavBar={true}>
            <Scene key="login" component={Login} title="Login" initial={true}/>
            <Scene key="signup" component={Signup} title="Register"/>
            <Scene key="first" component={First} title="Chapters"/>
            <Scene key="lesson" component={Lesson} title="Lessons"/>
           
            <Scene key = "home" 
            tabs
            tabBarStyle={{backgroundColor:'#1c313a',
                          alignContent:'center'}}>

            <Scene key="courses" component={Courses} hideNavBar icon={TabIcon}/>
             <Scene key="speaking" component={Speaking} hideNavBar icon={TabIcon}/>

           </Scene>
          
          </Stack>
       </Router>
      )
  }
}
