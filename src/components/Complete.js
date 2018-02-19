import React, { Component } from 'react';
import { View, Text, StyleSheet,AsyncStorage } from 'react-native';
import axios from 'axios';

var name = null;

export default class Activity8 extends Component {

    async get(){
        name = await AsyncStorage.getItem('username'); 
        alert(name);
    }

    constructor(props){
        super(props);

        this.get();

        var chapter = this.props.chapter;
        var topic = this.props.topic;

        console.log(name);

        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/update_progress.php', {
            name: name,
            chapter: chapter,
            topic: topic
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.compBox}>
                    <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>Lesson Complete !!</Text>
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
