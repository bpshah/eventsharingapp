import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar, Image, ScrollView, Dimensions} from 'react-native';
import Events from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/Events.js';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import firebase from 'react-native-firebase';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';

//import {exitAlert} from './ExitAlert';
//import { BackAndroid } from 'react-native';
//AndroidKeyboardAdjust.setAdjustNothing();

export default class Login extends Component {

  constructor(){
    super()
    this.state = {
      email : 'bhumit1206@gmail.com',
      password : 'asdf1234',
      errorMessage: null,
    }
  }

  onLayout(e) {
    const {
        nativeEvent : { layout : {height}}} = e;
        this.height = height;
        this.forceUpdate();
      }

  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {console.log(res)})
      .catch(error => {this.setState({ errorMessage: error.message });
            console.log(error)})
    console.log("Logged In");
  }

  render(){
    const {height : heightOfDeviceScreen} = Dimensions.get('window');
    return(
      <ScrollView contentContainerStyle =  {{minHeight : this.height || heightOfDeviceScreen}}
                  onLayout = {this.onLayout.bind(this)}
                  backgroundColor = '#E96A69' >

          <View style = {styles.childcontainer1}>
            <Image source={require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png')} style = {{height : 100, width : 100,}} />
          </View >

        <View style = {styles.childcontainer2}
              keyboardDismissMode = 'on-drag'
              removeClippedSubviews = {false}>
            <TextInput style = {styles.input}
                  title = 'Username'
                  placeholder = 'Username or Email'
                  placeholderTextColor = 'rgba(255,255,255,0.7)'
                  returnKeyType = 'next'
                  keyBoardType = 'email-address'
                  autoCapitalize = 'none'
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}

            />
            <TextInput style = {styles.input}
                  placeholder = 'Password'
                  secureTextEntry = {true}
                  returnKeyType = 'go'
                  placeholderTextColor = 'rgba(255,255,255,0.7)'
                  maxLength = {20}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
            />
            <Text style = {styles.textstyle}
            onPress={() => this.props.navigation.navigate('FPassword')}>
                          Forgot Password?
            </Text>
        </View>

        <View style = {styles.childcontainer3}>
            <TouchableOpacity style = {styles.buttonContainer1}
                              onPress={this.handleLogin}>
                  <Text style = {styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.buttonContainer2}
                              onPress={() => this.props.navigation.navigate('Signup')}
                  >
                  <Text style = {styles.buttonText}>Signup</Text>
            </TouchableOpacity>
        </View >
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  container : {
    flex : 1,
    backgroundColor : Colors.primaryAppColor,
  },
  childcontainer1 : {
    flex : 2,
    alignItems : 'center',
    justifyContent : 'center',
    //paddingTop: 0,
  },
  childcontainer2 : {
    flex : 1,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'space-evenly'
  },
  childcontainer3 : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'flex-start',
    justifyContent : 'space-evenly'
  },
  input : {
    height : 40,
    width : '80%',
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : 10,
    paddingHorizontal : 15,
    color : Colors.white,
  },
  buttonContainer1 : {
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    width : '40%',
    bottom : '0%',
  },
  buttonContainer2 : {
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    width : '40%',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
  buttonAlign : {
    flex : 2,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'space-between',
  },
  textstyle : {
    color : Colors.white,
    paddingVertical : 10,
  },
});
