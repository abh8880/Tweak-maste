import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage,TouchableOpacity,Dimensions } from 'react-native';

import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Foundation';

var name = null;
var correct = 0;
var chapter = 1;
var chap_name = ['Basic I','Classic I','Crux Link','Classic II','Self Mode','Ace Ally','Crackerjack','Sum Poll'];
import {Actions} from 'react-native-router-flux';
export default class Activity8 extends Component {

    async get(){
        name = await AsyncStorage.getItem('username'); 
        alert(name);
    }

    constructor(props) {
    super(props);

    this.get();

        correct = this.props.correct;
        chapter = this.props.chapter;
        console.log("Test Result of chapter:" + chapter);

        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/insert_score.php', {
            name: name,
            score: correct,
            chapter: chapter
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
        });
    };


  back_to_decks = () =>{
    Actions.lesson({Chapter:this.props.chapter});
  }

    render(){
        if (correct>=7) 
        {
            var remark = "Test Cleared";
        }
        else
        {
            var remark = "Test not Cleared";
        }
        return(
            <View style={styles.container}>
                <View style={styles.compBox}>
                    <Text style={styles.Title}>{remark}</Text>
                    <View style={styles.name}>
                    <View>
                    <Text style={styles.chapterText}>{chap_name[chapter-1]}</Text>
                    </View>
                    <View>
                      <IconM name="checkbox-marked-circle" size={32} color="#ffd700" />
                    </View>
                    </View>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'#ffffff',marginTop:10}}>Your Score: {correct}/10</Text>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'#ffffff',marginTop:10}}>Passing: 7/10</Text>



                      <TouchableOpacity onPress={() => Actions.first({username:username})}>
                        <View style={styles.completeBtn}>
                        <View style={{alignItems:'center'}}>
                        <Text style={styles.continueText}>NEXT CHAPTER</Text>
                        </View>

                         <View style={{marginLeft:'17%'}}>
                         <Icon name="arrow-with-circle-right" size={35} color="#ab0c54" />
                        </View>

                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.back_to_decks() }>
                <View style={styles.CurrentBtn}>
                        <View style={{ flexWrap:'wrap',}}>
                        <Text style={styles.continueText}>PRACTICE CURRENT </Text>
                        <View style={{alignItems:'center'}}>
                         <Text style={styles.continueText}>CHAPTER </Text>
                         </View>
                        </View>

                         <View>
                         <IconM name="book-open" size={35} color="#ab0c54" />
                        </View>

                </View>
                </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#34495e',
    },

    compBox: {
        flex: 6,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#060b2f',
      },

        completeBtn:{
         marginTop:'20%',
        flexDirection:'row',
        backgroundColor:'white',
        borderRadius:10,
        width:Dimensions.get('window').width/1.5,
         height:Dimensions.get('window').height/12,
         alignItems:'center',
         justifyContent:'center',
         borderWidth:2,
         borderColor:'#ab0c54'

      },
      CurrentBtn:{
        marginTop:'5%',
        flexDirection:'row',
        backgroundColor:'white',
        borderRadius:10,
        width:Dimensions.get('window').width/1.5,
         height:Dimensions.get('window').height/12,
         alignItems:'center',
         justifyContent:'center',
         borderWidth:2,
         borderColor:'#ab0c54',
        

      },
      continueText:{
       
        fontSize:18,
        fontFamily:'Museo 700',
        color:'black'
      },
      Progress:{
       
        marginTop:'12%',
         marginBottom:'12%',
         alignItems:'center',
         
      },
      name:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
      },
      chapterText:{
        fontSize:25, 
        fontFamily:'Museo 500',
         color:'#ffd700'
      },
      Title:{
        fontSize:40, 
        fontFamily:'Museo 500',
         color:'#ffffff',
         flex:0.3
      }
  });
