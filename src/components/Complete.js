import React, { Component } from 'react';
import { View, Text, StyleSheet,AsyncStorage,TouchableOpacity,Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
import * as Progress from 'react-native-progress';
var name = null;

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'});
import {Actions} from 'react-native-router-flux';

export default class Complete extends Component {

    // async get(){
    //     name = await AsyncStorage.getItem('username'); 
    //     alert(name);
    // }

    constructor(props){
        super(props);

        var username = this.props.username;
        // var username = this.props.navigation.state.params.username
        // console.log("")
        alert("in complete "+username)
        this.state = {sheet:'',name:name,progress_val:0};

        // this.get();

        var chapter = this.props.chapter;
        var topic = this.props.topic;

        // console.log(name);

        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/update_progress.php', {
            name: username,
            chapter: chapter,
            topic: topic
          })
          .then(function (response) {
            console.log(response);

             axios.get('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/get_progress.php', {
                  params: {
                    name: username
                  },
                  dataType: 'json'
                }).then(function (response) {
                  console.log("\n\n\n\n");
                  console.log(response.data[0].topic);
                  var temp = response.data[0].topic.length/4;
                  console.log(temp)
                  this.setState({progress_val:temp});
                  console.log("after setState")
                  // console.log(response.data.topic);
                  console.log("\n\n\n\n");
                }.bind(this)).catch(function (error) {
                    console.log(error);
                });
           }.bind(this)) 
          .catch(function (error) {
            console.log(error);
        });

        db.transaction((tx) => {
             tx.executeSql('SELECT sheet FROM summary WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
                var row = results.rows.item(0);
                this.setState({sheet:row.sheet});
             });
        });

        db.transaction((tx) => {
         tx.executeSql('SELECT name FROM names WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
            var row = results.rows.item(0);
            this.setState({name:row.name});
         });
    });
    }

	back_to_decks = () =>{
	    Actions.lesson({Chapter:this.props.chapter});
	}
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.compBox}>
                <Text style={{fontSize:38,color:'#ffffff',fontFamily:'Museo 500'}}>Topic Completed</Text>
                    <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>{this.state.sheet}</Text>

                    <View style={styles.Progress}>
                    <Progress.Circle progress={this.state.progress_val} size={90} animated={true}
                  unfilledColor={'rgba(245,245,245,0.8)'} color={'rgba(240,199,27,1)'} borderWidth={0} thickness={6} showsText={true}/>
                   </View>
                  <Text style={{fontSize:22,color:'#f0c71b',fontFamily:'Museo 500'}}>You have finished {this.state.name} </Text>


                <TouchableOpacity onPress={() => this.back_to_decks() }>
                <View style={styles.completeBtn}>
                        <View>
                        <Text style={styles.continueText}>NEXT</Text>
                        </View>

                         <View style={{marginLeft:'5%',backgroundColor:''}}>
                         <Icon name="arrow-with-circle-right" size={35} color="#002951" />
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
      backgroundColor: '#002951',
    },

    compBox: {
        flex: 6,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#002951',
            width:Dimensions.get('window').width,
      },
      completeBtn:{
         marginTop:'20%',
        flexDirection:'row',
        backgroundColor:'white',
        borderRadius:10,
        width:Dimensions.get('window').width/2,
         height:Dimensions.get('window').height/12,
         alignItems:'center',
         justifyContent:'center',
         borderWidth:3,
         borderColor:'black'

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
         
      }
});
