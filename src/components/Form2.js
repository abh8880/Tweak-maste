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

   constructor(props){
    super(props);
    this.state = { username: '', password: ''};
    this.onPress = this.onPress.bind(this);
   
  }

  onPress(){
    let uname = this.state.username;
    let pass = this.state.password;
    AsyncStorage.setItem('username', uname).done();
    AsyncStorage.setItem('password', pass).done();
    
       axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/Login.php', 
        {
           
          
            username: uname,
            password: pass
          })

          .then(function (response) {
            console.log(response.data);

             if(response.data=='success')
             {
             
              Actions.home();
              
              this.setState({username: uname,password: pass});
            
             }
            
            else
            alert('Login failed');

          })
          
          .catch(function (error) {
            console.log('login dead');
        });



      
  }

  check(){

    AsyncStorage.getItem('username').then((username) => {
         if(username)
        Actions.home();
        this.setState({username: username});
       
    })

    AsyncStorage.getItem('password').then((password) => {
       if(password)
      Actions.home();
      this.setState({password: password});
      
    })
  }

  

  componentWillMount(){
    this.check();
  } 
  render(){

        
       

    return(
      <View style={styles.container}>
          
              <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Username"
              placeholderTextColor = "rgba(255,255,255,0.8)"
              selectionColor="#fff"
              keyboardType="default"
               value={this.state.username}
              onSubmitEditing={()=> this.password.focus()}
              onChangeText={(text) => this.setState({username:text})}
              />

          <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = "rgba(255,255,255,0.8)"
              value={this.state.password}
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
    fontFamily: 'Museo 500',
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.6)',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:20,
    fontFamily: 'Museo 700',
    color:'#1c313a',
    textAlign:'center'
  }
  
});


