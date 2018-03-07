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
        console.log("Modal correct="+this.props.correct);
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
                    { temp ? <View style={styles.correctContainer}><Text style={styles.correctText}>Correct Answer</Text></View> :
                    <View style={styles.incorrectContainer}><Text style={styles.incorrectText}>  Incorrect Answer</Text></View> }
                    
                     <View style={styles.Resultstatus}><Text style={styles.ResultText}>Correct answer:{"\n"+this.props.correct}</Text></View>
                    </View>

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
        
         borderRadius:5,
        marginTop:'10%',
        backgroundColor:'#dff0d8',
        alignItems:'center'
      },
      incorrectContainer:{
     
        borderRadius:5,
        marginTop:'10%',
        backgroundColor:'#f2dede',
        alignItems:'center'
      },
      correctText:{
        color:'#6e936c',
         fontSize: 20,
         fontFamily:'Museo 500'
      },
      incorrectText:{
        color:'#a83a38', 
        fontSize: 20,
        fontFamily:'Museo 500'
      },
      Resultstatus:{
        width:300,
        backgroundColor:'#d9edf7',
          borderRadius:5,
        marginTop:'5%',
        alignItems:'center'

      },
      ResultText:{
        color:'#5c8ca5',
         fontSize: 20,
         fontFamily:'Museo 500'
      }
});

