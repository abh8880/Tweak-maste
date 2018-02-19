import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import {Actions} from 'react-native-router-flux';

export default class Logo extends Component<{}> {

   onPress = () => {
          alert('hello');
           var name = this.state.name;
        var email = this.state.email;
        var username = this.state.username;
        var password = this.state.password;

        console.log(name);
        

        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/Register.php', 
        {
            name: name,
            email: email,
            username: username,
            password: password
          })

          .then(function (response) {
            console.log(response.data);

            if(response.data=='exists')
           alert('Email already registered');

            else if(response.data=='success'){
                alert('Registeration successful');
                Actions.home();
            }
          
            else
            alert('Registeration failed');
          })

          .catch(function (error) {
            console.log('Registeration unsuccessful');
        });

  

          }
   constructor(props) {
    super(props);

    state={"name":'',"email":'',"username":'',"password":''};

    };

  render(){

        
       

    return(
      <View style={styles.container}>
          <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Name"
              placeholderTextColor = "#ffffff"
              selectionColor="#fff"
              keyboardType="default"
              onSubmitEditing={()=> this.password.focus()}
              onChangeText={(text) => this.setState({name:text})}
              />

            <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Email"
              placeholderTextColor = "#ffffff"
              selectionColor="#fff"
              keyboardType="email-address"
              onSubmitEditing={()=> this.password.focus()}
              onChangeText={(text) => this.setState({email:text})}
              />
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
             <Text style={styles.buttonText}>Sign up</Text>
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
    fontFamily: 'Museo 500',
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.6)',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:20,
    fontFamily:'Museo 700',
    color:'#1c313a',
    textAlign:'center'
  }
  
});
    