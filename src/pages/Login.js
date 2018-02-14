import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

import axios from 'axios';
import Logo from '../components/Logo';
import {Actions} from 'react-native-router-flux';
import { StackNavigator } from 'react-navigation';

export default class Login extends Component<{}> {

	 onPress = () => {
        var username = this.state.username;
        var password = this.state.password;

        console.log(username);
        
        

        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/Login.php', 
        {
           
          
            username: username,
            password: password
          })

          .then(function (response) {
            console.log(response.data);

             if(response.data=='success')
             {
             console.log('Login successful');
             this.props.navigation.navigate('StartPage');
             }
            
          
            else
            console.log('Login failed');

          })
          
          .catch(function (error) {
            console.log('login dead');
        });



          }

   constructor(props) {
    super(props);

    state={"username":'',"password":''};

    };


	render() {
		return(
       <KeyboardAvoidingView style={styles.KeyboardContainer}>
			<View style={styles.container}>
				<Logo/>
				 <View style={styles.containerLogin}>
          
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
           <TouchableOpacity style={styles.button}  onPress={this.onPress}>
             <Text style={styles.buttonText}>Login</Text>
           </TouchableOpacity>     
      </View>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Don't have an account yet?</Text>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}><Text style={styles.signupButton}> Signup</Text></TouchableOpacity>
				</View>
			</View>	
      </KeyboardAvoidingView>
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
  containerLogin : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',

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
  },
  KeyboardContainer: {
    flex: 1,
    justifyContent: 'center'
  },
});
