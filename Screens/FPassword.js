import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar} from 'react-native';
import firebase from 'react-native-firebase';

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
      <Text style={{color: 'white', fontSize : 20, marginTop : 100}}>Please enter email address :{"\n"}
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
    backgroundColor : '#E96A69',
    padding : 20,
    justifyContent : 'flex-start',

    //flexDirection: 'column',
  },
  input : {
    height : 40,
    backgroundColor : 'rgba(255,255,255,0.2)',
    marginBottom : 20,
    paddingHorizontal : 15,
    color : '#FFF'
  },
  buttonContainer : {
    //flex:1,
    backgroundColor : '#E96A69',
    paddingVertical : 15,
    //width: '40%',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : '#FFFFFF',
    paddingVertical : 15,
    fontWeight : '700'
  },
});
