import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import Select from './Select';
var timeout;
var status;
var flag = 0;
var flip = 1;
export default class Time_up extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          status: 0,
          flip: 1
        }; 
        
};

    render(){
        if (flip==1) 
        {
            tm = setTimeout(() => {
                this.setState({ status:1 });
                console.log("inside timeout");
                this.setState({ flip:0 });
            }, 2000);
            
        }
        

        if(this.state.status == 0){
            return(
                <View style={styles.container}>
                    <View style={styles.resultBox}><Text style={{color:'white', fontSize: 30}}>{ 'Your ran out of time :(' }</Text></View>
                </View>
            );
        }
        else if (this.state.status == 1) 
        {
            clearTimeout(tm);

            return(
                     <Select topic={this.props.topic} chapter={this.props.chapter} end={this.props.end}/>
                );
        }

        else {
            setTimeout(() => {
                 flag=1;
            }, 1000);
            return(
                <View style={styles.container}>
                    <View style={styles.resultBox}><Text style={{color:'white', fontSize: 30}}>{ 'Lets try another one :)' }</Text></View>
                </View>
            );
           

        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#34495e',
    },

    resultBox: {
        flex: 6,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#9FA8DA',
      },

    subBox: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#3F51B5',
      },

      button: {
        margin: 30,
        width: 100,
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        borderRadius: 50
      }
});