import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import Select from './Select';

export default class Result extends Component {
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

        // console.log(this.props.score);
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
    
                    <View style={styles.resultBox}><Text style={{color:'#1c313a', fontSize: 30}}>{ temp ?  'Correct Answer !' : 'Wrong Answer :(' }</Text></View>
    
                    <View style={styles.subBox}>
                        <TouchableOpacity onPress={() => this._handleNextPress()}>
                          <View style={styles.button}>
                            <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>NEXT</Text>
                          </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        else{
            return(
                <Select score={temp} topic={this.props.topic} chapter={this.props.chapter} end={this.props.end} repeat={repeat} rem_rep={this.props.rem_rep}/>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#e5e5e5',
    },

    resultBox: {
        flex: 6,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      },

    subBox: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#1c313a',
      },

      button: {
        margin: 30,
        width: 100,
        alignItems: 'center',
        backgroundColor: '#1c313a',
        borderRadius: 50
      }
});

