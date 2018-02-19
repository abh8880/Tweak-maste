import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import axios from 'axios';
import Courses from '../pages/Courses';
import {Actions} from 'react-native-router-flux';

export default class Logo extends Component<{}> {

  async set(username){
    await AsyncStorage.setItem('username', username); 
  }

   onPress = () => {
          alert('hello');
         
        var username = this.state.username;
        var password = this.state.password;

        console.log(username);
        
        this.set(username);

        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/Login.php', 
        {
           
          
            username: username,
            password: password
          })

          .then(function (response) {
            console.log(response.data);

             if(response.data=='success')
             {
             alert('Login successful');
             Actions.home();
             }
            
          
            else
            alert('Login failed');

          })
          
          .catch(function (error) {
            console.log('login dead');
        });



          }

   constructor(props) {
    super(props);

    state={"username":'',"password":''};

    };

  render(){

        
       

    return(
      <View style={styles.container}>
          
              <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Username"
              placeholderTextColor = "#ffffff"
              selectionColor="#fff"
              keyboardType="default"
              onSubmitEditing={()=> this.password.focus()}
              onChangeText={(text) => this.setState({username:text})}
              />

          <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = "#ffffff"
              ref={(input) => this.password = input}
              onChangeText={(text) => this.setState({password:text})}
              />  
           <TouchableOpacity style={styles.button} onPress={this.onPress}>
             <Text style={styles.buttonText}>Login</Text>
           </TouchableOpacity>     
      </View>
      )
  }
}

const styles = StyleSheet.create({

  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'#1c313a',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});


