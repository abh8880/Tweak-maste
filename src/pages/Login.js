import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from 'react-native';

import Logo from '../components/Logo';
import Form from '../components/Form2';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {Actions} from 'react-native-router-flux';

export default class Login extends Component<{}> {

	signup() {
		Actions.signup()
	}

  componentDidMount(){
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      // play services are available. can now configure library
    })
      .catch((err) => {
        console.log("Play services error", err.code, err.message);
      })

    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      // iosClientId: <FROM DEVELOPER CONSOLE>, // only for iOS
      webClientId: "409329322623-oin35terk5nvnvkf1f8mlqe3vc7q8c36.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
        // offlineAccess: true // if you want to access Google API on behalf of the user FROM YOUR SERVER
        // hostedDomain: '' // specifies a hosted domain restriction
        // forceConsentPrompt: true // [Android] if you want to show the authorization prompt at each login
        // accountName: '' // [Android] specifies an account name on the device that should be used
      })
    .then(() => {
            // you can now call currentUserAsync()
          });
  }

  handle(){
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
        this.setState({ user: user });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }

	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<Form type="Login"/>
        <Text style={styles.welcome}>Sign In With Google</Text>
        <GoogleSigninButton
          style={{ width: 150, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.handle.bind(this)} />
				<View style={styles.signupTextCont}>

					<Text style={styles.signupText}>Don't have an account yet?</Text>
					<TouchableOpacity onPress={this.signup}><Text style={styles.signupButton}> Signup</Text></TouchableOpacity>
				</View>
        
			</View>	
			)
	}
}
const styles = StyleSheet.create({
  container : {
    backgroundColor:'#1c313a',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row',
    
  },
  signupText: {
  	color:'rgba(255,255,255,0.6)',
  	fontSize:16,
    fontFamily: 'Museo 500',
  },
  signupButton: {
  	color:'#ffffff',
  	fontSize:20,
  	fontFamily: 'Museo 900',
    
  },
  welcome:{
    color:'#ffffff',
    fontSize:20,
    fontFamily: 'Museo 900',
  }
});
