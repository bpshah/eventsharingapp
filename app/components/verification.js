import React, { Component } from 'react'
import {  ActivityIndicator,  AppRegistry,  StyleSheet,  Text,  View} from 'react-native';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';
import firebase from 'react-native-firebase';




export default class Verification extends Component {

  constructor(props){
    super(props);
    this.state = {
      verified : false,
    }
  }

  componentDidMount(){

    firebase.auth().currentUser.sendEmailVerification().then(() => {

      }).catch((error) => {
        console.log(error);
      })
  }

  render(){
    return(
      <View style = {{flex : 1,justifyContent : 'flex-start',paddingTop : 50,paddingLeft : 20,flexDirection : 'column', backgroundColor : Colors.primaryAppColor}}>
        <Text style = {{color : 'white',fontSize : 18}} >A Verification Mail has been sent to your email address.{'\n'}{'\n'}Please Verify Your Email</Text>
      </View>
    );
  }
}
