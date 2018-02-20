import React, { Component } from 'react';
import {Actions, Router, Stack, Scene} from 'react-native-router-flux';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const height = Dimensions.get('window').height;

import Login from './pages/Login';
import Signup from './pages/Signup';
import First from './components/First';
import Lesson from './components/Lesson';
import Courses from './pages/Courses';
import Speaking from './pages/Speaking';

// VocabModule pages start
import VocabHome from './components/VocabModule/VocabHome';
import Deck from './components/VocabModule/Deck';
import Word from './components/VocabModule/WordCards/Word';
import DeckComplete from './components/VocabModule/WordCards/DeckComplete';
// VocabModule pages end

import { StackNavigator } from 'react-navigation';

const TabIcon =({selected, title})=> {
  return(
    <Text style= {{fontSize:100}}
    >{title}</Text>
    );
};

export default class Routes extends Component {

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
        padding: 20
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
      </View>
    )
  }

  render() {
    return(
      <Router navigationBarStyle={styles.navBar} titleStyle={styles.navBarTitle} barButtonTextStyle={styles.barButtonTextStyle} barButtonIconStyle={styles.barButtonIconStyle}>
          <Stack key="root" >
            <Scene key="login" component={Login} title="Login" initial={true} hideNavBar={true}/>
            <Scene key="signup" component={Signup} title="Register"/>


            <Scene key="home"
              tabs
              tabBarStyle={{
                backgroundColor: '#1c313a',
                alignContent: 'center'
              }}
            >
              <Scene key="courses" component={Courses} hideNavBar icon={TabIcon} />
              <Scene key="speaking" component={Speaking} hideNavBar icon={TabIcon} />
            </Scene>

            <Scene key="first" component={First} title="Chapters"/>
            <Scene key="lesson" component={Lesson} title="Lessons"/>

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
      )
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor:'#0D47A1',
},
navBarTitle:{
    color:'#FFFFFF'
},
barButtonTextStyle:{
    color:'#FFFFFF'
},
barButtonIconStyle:{
    tintColor:'rgb(255,255,255)'
},
});
