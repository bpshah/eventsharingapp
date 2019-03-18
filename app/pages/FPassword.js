import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar,ToastAndroid} from 'react-native';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';

export default class FPassword extends Component{

  constructor(){
    super();
    this.state = {
      email : '',
    }
  }

  handleResetPwd = () => {

    if(this.state.email != ''){
      firebase
        .auth()
        .sendPasswordResetEmail(this.state.email)
        .then(() => this.props.navigation.navigate('Login'))
        .catch(error => this.setState({ errorMessage: error.message }))
    }
    else {
      ToastAndroid.showWithGravity( 'Please enter email.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
    }
  }

  static navigationOptions = {
    header : null,
  }

  render(){
    return(
      <View style = {styles.container}>
      <StatusBar barStyle = 'light-content'/>
      <Text style={{color: Colors.textColor, fontSize : 20, marginTop : '10%'}}>Forgot Your Password?{"\n"}
      </Text>
      <TextInput style = {styles.input}
            placeholder = 'Username or Email'
            placeholderTextColor = 'rgba(255,255,255,0.7)'
            returnKeyType = 'next'
            keyBoardType = 'email-address'
            autoCapitalize = 'none'
            autoCorrect = {false}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
      />
      <Text style={{color: 'white'}}>A link will be sent to your email address to change password {"\n"}
      </Text>
      <TouchableOpacity style = {styles.buttonContainer}
                        onPress={this.handleResetPwd}>
            <Text style = {styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      </View>

    );
  }
}


const styles = StyleSheet.create({

  container : {
    flex : 1,
    backgroundColor : Colors.primaryAppColor,
    padding : 20,
    justifyContent : 'flex-start',
  },
  input : {
    height : 40,
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : '6%',
    marginTop : '1%',
    paddingHorizontal : 15,
    borderBottomWidth : 0.75,
    color : Colors.inputColor,
  },
  buttonContainer : {
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
});
