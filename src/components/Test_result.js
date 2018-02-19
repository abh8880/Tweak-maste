import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';

import axios from 'axios';

var name = null;
var correct = 0;
var chapter = 1;

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
    render(){
        if (correct>=9) 
        {
            var remark = "You Passed !!";
        }
        else
        {
            var remark = "You Failed !!";
        }
        return(
            <View style={styles.container}>
                <View style={styles.compBox}>
                    <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>Finished Attempt !!</Text>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'#ffffff',marginTop:10}}>Correct: {correct}</Text>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'#ffffff',marginTop:10}}>Result: {remark}</Text>
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
        backgroundColor: '#9FA8DA',
      },
});
