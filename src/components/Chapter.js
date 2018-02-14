import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text,Dimensions} from 'react-native';
import Select from './Select';


export default class Chapter extends Component {

    constructor(props) {
            super(props);
        
            this.state = {
            topic:0,
        };
    };

    _handleButtonPress = (tp) => {
        this.setState({topic:tp});
    };
        

    render(){
            
        if(this.state.topic == 0){
            return(
                <View>
                    <View style={styles.chapter}>
                        <Text style={{ fontSize: 30 }} >{"CHAPTER "+this.props.chapter}</Text>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.topic1} onPress={() => this._handleButtonPress(1)}>
                            <View>
                                <Text style={{ fontSize: 15 }} >Topic 1</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.topic4} onPress={() => this._handleButtonPress(4)}>
                            <View>
                                <Text style={{ fontSize: 15 }} >Topic 4</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topic2} onPress={() => this._handleButtonPress(2)}>
                            <View>
                                <Text style={{ fontSize: 15 }} >Topic 2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.topic3} onPress={() => this._handleButtonPress(3)}>
                            <View>
                                <Text style={{ fontSize: 15 }} >Topic 3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <View style={{marginLeft: (Dimensions.get('window').width / 2) - 60,}}>
                            <TouchableOpacity style={styles.button} onPress={() => this._handleButtonPress(-1)}>
                                <View>
                                    <Text style={{ fontSize: 15 }} >Attempt Test</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            );
        }
        else if (this.state.topic == -1) 
        {
            return(
                <Select topic={this.state.topic} chapter={this.props.chapter} />
            );
        }
        else
        {
            return(
                <Select topic={this.state.topic} chapter={this.props.chapter} />
            );
        }

    }

}

const styles = StyleSheet.create({
    chapter: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 80,
    },
    button: {
        marginTop: 75,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        backgroundColor: '#7986CB',
        padding: 15,
    },
    row: {
        flexDirection: 'row',
    },
    topic1: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:80,
        height:80,
        backgroundColor:'#fff',
        borderRadius:100,
        marginLeft: (Dimensions.get('window').width / 2) - 40,
    },
    topic4: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:80,
        height:80,
        backgroundColor:'#fff',
        borderRadius:100,
        marginLeft: (Dimensions.get('window').width / 6)-2,

    },
    topic2: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:80,
        height:80,
        backgroundColor:'#fff',
        borderRadius:100,
        marginLeft: (Dimensions.get('window').width / 4)-2,

    },
    topic3: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:80,
        height:80,
        backgroundColor:'#fff',
        borderRadius:100,
        marginLeft: (Dimensions.get('window').width / 2) - 40,

    }

});