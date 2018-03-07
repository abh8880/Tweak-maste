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
  Image
} from 'react-native';

import { Actions } from 'react-native-router-flux';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class ChapterCard extends Component {
  constructor(props){
    super(props);
  }

  navigateToDeckPage = (chapter) => {
    Actions.deck({
      unit: this.props.data.unit,
      chapter: chapter
    });
  }

  render() {
    return (
      <View style={styles.cardBody}>
        <View style={styles.ChapterRow1}>
         <TouchableOpacity  onPress={() => {this.navigateToDeckPage(1)}}>
        <View style={styles.box1}>
       
            <View style={styles.insideBox}>
               <Image
                  source={require('../../../icons/9.png')}
                  style={{width: 100, height: 100}}
                />
            </View>

              <View style={styles.insideTextBox}>
              <Text style={styles.Text}>Chapter 1</Text>
            </View>
           
        </View>
        </TouchableOpacity>



          <TouchableOpacity onPress={() => {this.navigateToDeckPage(2)}}>
        <View style={styles.box2}>

            <View style={styles.insideBox}>
               <Image
                  source={require('../../../icons/8.png')}
                  style={{width: 100, height: 100}}
                />
            </View>

            <View style={styles.insideTextBox}>
              <Text style={styles.Text}>Chapter 2</Text>
            </View>

        </View>
        </TouchableOpacity>
        </View>
           <View
              style={{
                borderBottomColor: '#ececec',
                borderBottomWidth: 10
              }}
            />


         <View style={styles.ChapterRow2}>
        <TouchableOpacity  onPress={() => {this.navigateToDeckPage(3)}}>
        <View style={styles.box1}>
          <View style={styles.insideBox}>
               <Image
                  source={require('../../../icons/8.png')}
                  style={{width: 100, height: 100}}
                />
          </View>

           <View style={styles.insideTextBox}>
             <Text style={styles.Text}>Chapter 3</Text>
            </View>
        </View>
        </TouchableOpacity>

          <TouchableOpacity  onPress={() => {this.navigateToDeckPage(3)}}>
        <View style={styles.box2}>
           <View style={styles.insideBox}>
            <Image
                  source={require('../../../icons/8.png')}
                  style={{width: 105, height: 110}}
                />
          </View>
           <View style={styles.insideTextBox}>
              <Text style={styles.Text}>Chapter 4</Text>
            </View>
        </View>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardBody:{
    flex: 1,
    margin:'15%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignSelf:'center',
    elevation:15
  },
 
  ChapterRow1:{
    flexDirection:'row',
     alignItems:'center',
       backgroundColor:'#ececec'
  },
  ChapterRow2:{
    flexDirection:'row',
     alignItems:'center',
     backgroundColor:'#ececec'
      
  },
  box1:{
    width:width/2 - width/20,
    backgroundColor:'white',
    height:height/3,
    marginRight:'2%',
    borderRadius:5,
     alignItems:'center',
     
  },
  box2:{
   width:width/2 - width/20,
    backgroundColor:'white',
    height:height/3,
    marginLeft:'2%',
     borderRadius:5,
      alignItems:'center',
      
  },
  insideBox:{
     width: 110,
    height: 110,
    borderRadius: 100,
    backgroundColor:'white',
    marginTop:'10%',
    alignItems:'center'
  },
  insideTextBox:{
    marginTop:'10%'
  },
  Text:{
    fontFamily:'Museo 700',
    fontSize:20
  }
});
