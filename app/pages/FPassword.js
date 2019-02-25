import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar} from 'react-native';
import firebase from 'react-native-firebase';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';

export default class FPassword extends Component{

  constructor(){
    super();
    this.state = {
      email : '',
    }
  }

  handleResetPwd = () => {
        //const { email, pasword } = this.state
        firebase
          .auth()
          .sendPasswordResetEmail(this.state.email)
          .then(() => this.props.navigation.navigate('Login'))
          .catch(error => this.setState({ errorMessage: error.message }))
  }

  static navigationOptions = {
    header : null,
  }

  render(){
    return(
      <View style = {styles.container}>
      <StatusBar barStyle = 'light-content'/>
      <Text style={{color: Colors.textColor, fontSize : 20, marginTop : 100}}>Please enter email address :{"\n"}
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

    //flexDirection: 'column',
  },
  input : {
    height : 40,
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : 20,
    paddingHorizontal : 15,
    color : Colors.inputColor,
  },
  buttonContainer : {
    //flex:1,
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    //width: '40%',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
});
