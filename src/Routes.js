import React, { Component } from 'react';
import {Actions, Router, Stack, Scene} from 'react-native-router-flux';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  AsyncStorage
} from 'react-native';

import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

const height = Dimensions.get('window').height;

import Login from './pages/Login';
import Signup from './pages/Signup';
import First from './components/First';
import Lesson from './components/Lesson';
import Select from './components/Select';
import Courses from './pages/Courses';
import Speaking from './pages/SpeakingAlt';

// VocabModule pages start
import VocabHome from './components/VocabModule/VocabHome';
import Deck from './components/VocabModule/Deck';
import Word from './components/VocabModule/WordCards/Word';
import DeckComplete from './components/VocabModule/WordCards/DeckComplete';
// VocabModule pages end

var username = null;

import { StackNavigator } from 'react-navigation';

const TabIcon =({selected, title})=> {
  return(
    <Text style={{ fontSize: 18,fontFamily:'Museo 700', color: '#ffffff'}}
    >{title}</Text>
    );
};

const NavigatorMenu = () => (
  <Menu>
    <MenuTrigger text='...' customStyles={triggerStyles}/>
    <MenuOptions>
      <MenuOption customStyles={optionsStyles} onSelect={() => Actions.login()} text='Logout' />
    </MenuOptions>
  </Menu>
);

export default class Routes extends Component {


  async get(){
    username = await AsyncStorage.getItem('username');
    console.log("in routes.js , name: "+username)
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

    logout_func = () =>{
      AsyncStorage.removeItem('username').done();
      AsyncStorage.removeItem('password').done();
      Actions.login();
    }

    NavigatorMenu = () => {
      return(
        <Menu>
          <MenuTrigger text='. . .' customStyles={triggerStyles}/>
          <MenuOptions>
            <MenuOption customStyles={optionsStyles} onSelect={() => this.logout_func()} text='Logout' />
          </MenuOptions>
        </Menu>
      );
    }

  showBackArrow(dest) {
    if (dest != 'nope')
      return (
        <TouchableOpacity onPress={() => { Actions[dest](); }}>
          <Text style={{
            color: '#88bfff',              // back arrow color
            fontSize: 22,
            transform: [{ rotate: '180deg' }],
            marginTop: 5,
            paddingLeft: 20,
            paddingRight: 20,
          }}>
            ➔
          </Text>
        </TouchableOpacity>
      )
  }

  renderTitle(source) {
    return (

      <Text style={{
        color: '#88bfff',                // title color
        fontSize: 20,
        fontWeight: '500',
        paddingLeft: 20,
        paddingRight: 150
      }}>
        {source}
      </Text>
    )
  }

  createNavBar(source, dest) {
    return (
      <View style={{
        height: height / 12,
        flexDirection: 'row',
        backgroundColor: '#00232d',       // navbar color
        alignItems: 'center',
        elevation: 3,
      }}
      >
        {this.showBackArrow(dest)}
        {this.renderTitle(source)}
        {this.NavigatorMenu()}
      </View>
    )
  }

  render() {
    console.log('inside render: '+this.state.username)
    return(
      <MenuProvider>
      <Router>
          <Stack key="root" >
            <Scene key="login" component={Login} title="Login" initial={true} hideNavBar={true}/>
            <Scene key="signup" component={Signup} title="Register" hideNavBar={true}/>

            <Scene key="home"
              tabs
              activeBackgroundColor="#2b5060"
              showLabel={false}
              tabBarStyle={{
                backgroundColor: '#1c313a',
                alignContent: 'center'
              }}
            >
              <Scene key="coursestab" title="Courses" icon={TabIcon}>
                <Scene key="courses" component={Courses} hideNavBar/>
              </Scene>
              <Scene key="speakingtab" title="Speaking" icon={TabIcon} >
                <Scene key="speaking" component={Speaking} hideNavBar/>
              </Scene>
            </Scene>
              
            <Scene username={this.state.username} key="first" component={First} title="Chapters" navBar={() => this.createNavBar('Chapters', 'courses')}/>
            <Scene username={this.state.username} key="lesson" component={Lesson} title="Lessons" navBar={() => this.createNavBar('Lessons', 'first')}/>
            <Scene key="select" component={Select} title="Activities"/>

          {/*  VocabModule pages start  */}
            <Scene key="vocabHome"
              component={VocabHome}
              title="Units"
              //custom navbar ⭝
              navBar={() => this.createNavBar('Units', 'home')} //params => (sourcePage,destinationPage/nope)
            />

            <Scene key="deck"
              component={Deck}
              title="Decks"
              //custom navbar ⭝
              navBar={() => this.createNavBar('Deck', 'vocabHome')} //params => (sourcePage,destinationPage/nope)
            />

            <Scene key="word"
              component={Word}
              title="Word"
              //to change color of back arrow change color value in backButtonTintColor (don't delete backButtonTextStyle as backarrow falls back to default color on doing that)
              //(i have no clue why)
              backButtonTextStyle={{}}
              backButtonTintColor='#88bfff'              //backArrowColor
              titleStyle={{
                color: '#88bfff'                         //title color
              }}
              navigationBarStyle={{
                backgroundColor: '#00232d',           //navbar color
              }}
            />

            <Scene key="deckComplete"
              component={DeckComplete}
              title="DeckComplete"
              hideNavBar={true}
            />

          {/*  VocabModule pages end  */}

          </Stack>
       </Router>
       </MenuProvider>
      )
  }
}

const triggerStyles = {
  triggerText: {
    color: 'white',
  },
};

const optionsStyles = {
  optionWrapper: {
    backgroundColor: 'white',
    margin: 10,
  },
  optionText: {
    color: 'brown',
  },
};
