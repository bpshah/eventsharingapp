import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar, Image} from 'react-native';
import firebase from 'react-native-firebase';


export default class SplashScreen extends Component {

  componentDidMount(){
      setTimeout(() => {firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'TabNav' : 'Login')
    })},500);
  }

  render(){
    return(
      <View  style = {styles.Container}>
        <Image source={require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png')} style = {styles.imageContainer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer : {
    height : 150,
    width : 150,
  },
  Container : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
    flexDirection : 'column',
    backgroundColor : '#E96A69',
  },
});
