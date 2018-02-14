import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

var SQLite = require('react-native-sqlite-storage');

export default class Download extends Component{

    render(){

        axios.get('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/ret_data.php', {
            params: {
              chapter: 1
            }
          })
          .then(function (response) {
            console.log(response.data);

            var db = SQLite.openDatabase({name: 'new.db', location: 'default'});
        
            db.transaction((tx) => {
                tx.executeSql('CREATE TABLE IF NOT EXISTS act1 (id PRIMARY KEY, chapter INT, topic INT, status INT DEFAULT "0", question VARCHAR(100), answer VARCHAR(100), op1 VARCHAR(100), op2 VARCHAR(100), op3 VARCHAR(100), op4 VARCHAR(100), correct VARCHAR(100))', [], (tx, results) => {
                    console.log(results);
                    console.log("Table act1 created");

                    for(i in response.data){
                        var chapter = response.data[i].chapter;
                        var topic = response.data[i].topic;
                        var question = response.data[i].question;
                        var answer = response.data[i].answer;
                        var op1 = response.data[i].op1;
                        var op2 = response.data[i].op2;
                        var op3 = response.data[i].op3;
                        var op4 = response.data[i].op4;
                        var correct = response.data[i].correct;

                        db.transaction((tx) => {
                            tx.executeSql('INSERT INTO act1 (chapter,topic,question,answer,op1,op2,op3,op4,correct) VALUES(?,?,?,?,?,?,?,?,?)', [chapter,topic,question,answer,op1,op2,op3,op4,correct], (tx, results) => {
                                console.log("Inserted row:"+i);
            
                            });
                        
                        });
                    }
                });
            
            });

          })
          .catch(function (error) {
            console.log(error);
          });

        return(
            <View>
                <Text>Downloading</Text>
            </View>
        );
    }
}
