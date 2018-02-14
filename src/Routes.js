import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Login from './pages/Login';
import Signup from './pages/Signup';
import First from './components/First';
import Lesson from './components/Lesson';
import StartPage from './pages/StartPage';
import { StackNavigator } from 'react-navigation';

export default class Routes extends Component<{}> {
  render() {
    return(
      <Router>
          <Stack key="root" hideNavBar={true}>
            <Scene key="login" component={Login} title="Login" initial={true}/>
            <Scene key="signup" component={Signup} title="Register"/>
            <Scene key="first" component={First} title="Chapters"/>
            <Scene key="lesson" component={Lesson} title="Lessons"/>
            <Scene key="home" component={StartPage} title="Home"/>
          </Stack>
       </Router>
      )
  }
}
