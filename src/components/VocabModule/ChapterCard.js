/**
  * Author : Jaffrey Joy
  * Copyright (c) 2018 All Rights Reserved
**/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

import { Actions } from 'react-native-router-flux';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class ChapterCard extends Component {
  constructor(props){
    super(props);
  }

  navigateToDeckPage = (chapter) => {
    Actions.deck({
      chapter: chapter
    });
    // alert(chapter);
  }

   componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () =>{
       Actions.courses();
      return true;
    }



  render() {
    return (
      <View style={styles.cardBody}>
        <TouchableOpacity  onPress={() => {this.navigateToDeckPage(this.props.chapterNo)}}>
          <View style={styles.box}>

            <View style={{ alignSelf: 'flex-end', marginTop:'5%',marginRight:'5%'}}>
              <Icon name="checkbox" size={30} color="#fafafa" />
            </View>

            <View style={styles.insideBox}>
              <Image
                source={this.props.image}
                style={{width: 100, height: 100}}
              />
            </View>

            <View style={styles.insideTextBox}>
              <Text style={styles.Text}>Chapter {this.props.chapterNo}</Text>
            </View>

          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardBody:{
    margin:'3%',
    backgroundColor: '#fafafa',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    elevation:7
  },
  box:{
    width:width/2.2 - width/20,
    backgroundColor: '#fafafa',
    height:height/3,
    marginRight:'2%',
    borderRadius:5,
    alignItems:'center',
  },
  insideBox:{
    width: 110,
    height: 110,
    borderRadius: 100,
    backgroundColor: '#fafafa',
    alignItems:'center',
    flexDirection:'row',
  },
  insideTextBox:{
    marginTop:'10%'
  },
  Text:{
    fontFamily:'Museo 700',
    fontSize:20
  }
});
