import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import Select from './Select';

export default class ModalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          status: 0
    };
};

    _handleNextPress = () => {
        this.setState({ status:1 });
    };

    render(){

        console.log(this.props.score);
        var temp = this.props.score; //1
        var repeat = this.props.repeat; //0
        // if (this.props.topic!=-1) // for testing. everything correct while learning
        // {
        //     var temp = 1; //1
        //     var repeat = 0; //0
        // }
        //var temp = 1; //1
        //var repeat = 0; //0
        if(this.state.status == 0){
            return(
                <View style={styles.container}>
    
                    <View style={styles.resultBox}>
                    { temp ? <View style={styles.correctContainer}><Text style={{color:'#1c313a', fontSize: 20}}>Correct Answer</Text></View> :
                    <View style={styles.incorrectContainer}><Text style={{color:'red', fontSize: 20}}>  Incorrect Answer</Text></View> }</View>

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
      width:300,
      height:200,
      alignItems: 'center',
      backgroundColor: 'white',
    },

    resultBox: {
        
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'white',
      },
      correctContainer:{
        width:300,
         borderRadius:5,
        marginTop:'10%',
        backgroundColor:'#dff0d8',
        alignItems:'center'
      },
      incorrectContainer:{
        width:300,
        borderRadius:5,
        marginTop:'10%',
        backgroundColor:'#f2dede',
        alignItems:'center'
      },
      correctText:{
        color:'#6e936c',
         fontSize: 20
      },
      incorrectText:{
        color:'#a83a38', 
        fontSize: 20
      }
});

