import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import Logo from '../components/Logo';
import Form from '../components/Form2';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

export default class Login extends Component<{}> {

  signup() {
    Actions.signup()
  }

  componentDidMount() {
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

  handle() {
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
        // console.log(user.name);
        var name = user.name;
        var email = user.email;
        var username = user.givenName;
        var password = user.id;
        // console.log(name);
        // console.log(email);
        // console.log(username);
        // console.log(password);
        AsyncStorage.setItem('username', username).done();
        AsyncStorage.setItem('password', password).done();
        axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/Register.php',
          {
            name: name,
            email: email,
            username: username,
            password: password
          })

          .then(function (response) {
            console.log(response.data);

            if (response.data == 'exists')
              {
              axios.post('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/Login.php',
                {


                  username: username,
                  password: password
                })

                .then(function (response) {
                  console.log(response.data);

                  if (response.data == 'success') {
                    Actions.home();
                    this.setState({ username: username, password: password });
                  }
                  else
                    alert('Login failed');
                })

                // .catch(function (error) {
                //   console.log(error);
                //   alert('Network Error. Please try again.');
                // });
              }

            else if (response.data == 'success') {
              alert('Registeration successful');
              Actions.home();
            }

            else
              alert('Registeration failed');
          })

          .catch(function (error) {
            console.log('Registeration unsuccessful');
          });

        this.setState({ user: user });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }


  check() {

    AsyncStorage.getItem('username').then((username) => {
      if (username)
        Actions.home();
      this.setState({ username: username });

    })

    AsyncStorage.getItem('password').then((password) => {
      if (password)
        Actions.home();
      this.setState({ password: password });

    })
  }

  componentWillMount() {
    this.check();
  }

  render() {
    return (
      <View style={styles.container}>
        <Logo />
        <Form type="Login" />
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
  container: {
    backgroundColor: '#1c313a',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',

  },
  signupText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontFamily: 'Museo 500',
  },
  signupButton: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Museo 900',

  },
  welcome: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Museo 900',
  }
});
