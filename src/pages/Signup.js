 import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity,
  TextInput
} from 'react-native';

import Logo from '../components/Logo';

import axios from 'axios';

import {Actions} from 'react-native-router-flux';
import { StackNavigator } from 'react-navigation';

export default class Signup extends Component {

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
           console.log('Email already registered');

            else if(response.data=='success')
            console.log('Registeration successful');
          
            else
            console.log('Registeration failed');
          })

          .catch(function (error) {
            console.log('Registeration unsuccessful');
        });

  

          }
   constructor(props) {
    super(props);

    state={"name":'',"email":'',"username":'',"password":''};

    };

	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<View style={styles.containerSignup}>
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
           <TouchableOpacity style={styles.button}>
             <Text style={styles.buttonText} onPress={this.onPress}>Sign up</Text>
           </TouchableOpacity>     
      </View>
      
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Already have an account?</Text>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={styles.signupButton}> Sign in</Text></TouchableOpacity>
				</View>
			</View>	
			)
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
  	color:'rgba(255,255,255,0.6)',
  	fontSize:16
  },
  signupButton: {
  	color:'#ffffff',
  	fontSize:16,
  	fontWeight:'500'
  },
  containerSignup : {
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