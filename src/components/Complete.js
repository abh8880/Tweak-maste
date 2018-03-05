import React, { Component } from 'react';
import { View, Text, StyleSheet,AsyncStorage } from 'react-native';
import axios from 'axios';

var name = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'});

export default class Complete extends Component {

    async get(){
        name = await AsyncStorage.getItem('username'); 
        alert(name);
    }

    constructor(props){
        super(props);

        this.state = {sheet:''};

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

        db.transaction((tx) => {
             tx.executeSql('SELECT sheet FROM summary WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
                var row = results.rows.item(0);
                this.setState({sheet:row.sheet});
             });

        });
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.compBox}>
                <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>Summary Sheet</Text>
                    <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>{this.state.sheet}</Text>
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
