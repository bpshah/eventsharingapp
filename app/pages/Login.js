import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar, Image, ScrollView, Dimensions} from 'react-native';
import Events from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/Events.js';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import firebase from 'react-native-firebase';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';
import activityIndicator from 'C:/Users/DELL/Documents/EventSharingSystem/app/components/activityIndicator.js'
import Icon from 'react-native-vector-icons/FontAwesome5.js';


//import {exitAlert} from './ExitAlert';
//import { BackAndroid } from 'react-native';
//AndroidKeyboardAdjust.setAdjustNothing();

export default class Login extends Component {

  constructor(){
    super()
    this.state = {
      email : 'bhumit1206@gmail.com',
      password : 'asdf1234',
      errorMessage : null,
      loading : false,
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
      .then(() => {this.props.navigation.navigate('Events')})
      .catch(error => {this.setState({ errorMessage: error.message });
            console.log(error)})
    //console.log("Logged In");
  }
// {minHeight : this.height || heightOfDeviceScreen}
/*<View style = {styles.childcontainer1}>
  <Image source={require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png')} style = {{height : 100, width : 100,}} />
</View >*/
/*<TextInput style = {styles.input}
      title = 'Username'
      placeholder = 'Username or Email'
      placeholderTextColor = 'rgba(255,255,255,0.7)'
      returnKeyType = 'next'
      keyBoardType = 'email-address'
      autoCapitalize = 'none'
      onChangeText={email => this.setState({ email })}
      value={this.state.email}

/>*/
  render(){
    const {height : heightOfDeviceScreen} = Dimensions.get('window');
    return(
      <ScrollView contentContainerStyle =  {styles.container}>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '55%',marginRight : '8%',marginLeft : '3%'}}>
                  <Icon name="envelope"
                    size={22}
                    color='black'
                    style = {{marginLeft : '10%',marginRight : '3.5%',marginBottom : '1%',alignSelf : 'center'}}/>
                  <TextInput style = {styles.input}
                    title = 'Username'
                    placeholder = 'Username or Email'
                    placeholderTextColor = 'rgba(255,255,255,0.7)'
                    returnKeyType = 'next'
                    keyBoardType = 'email-address'
                    autoCapitalize = 'none'
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}/>
            </View>
            <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginRight : '8%',marginLeft : '3%'}}>
                  <Icon name="lock"
                    size={22}
                    color='black'
                    style = {{marginLeft : '10%',marginRight : '3.5%',marginBottom : '1%',alignSelf : 'center'}}/>
                    <TextInput style = {styles.input}
                          placeholder = 'Password'
                          secureTextEntry = {true}
                          returnKeyType = 'go'
                          placeholderTextColor = 'rgba(255,255,255,0.7)'
                          maxLength = {20}
                          onChangeText={password => this.setState({ password })}
                          value={this.state.password}
                    />
            </View>
            <Text style = {styles.textstyle}
                  onPress={() => this.props.navigation.navigate('FPassword')}>
                                Forgot Your Password?
            </Text>
            <View style = {{flexDirection : 'row',justifyContent : 'flex-start',marginLeft : '20%',marginTop : '4%'}}>
              <TouchableOpacity style = {styles.buttonContainer1}
                                onPress={this.handleLogin}>
                    <Text style = {styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style = {{flexDirection : 'row',justifyContent : 'flex-start',marginLeft : '20%',marginTop : '1%'}}>
            <TouchableOpacity style = {styles.buttonContainer1}
                              onPress={() => this.props.navigation.navigate('Signup')}>
                  <Text style = {styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : '#4682B4',
    flexDirection : 'column',
    justifyContent : 'flex-start',
    //alignItems : 'center',
  },
  childcontainer1 : {
    //flex : 2,
    alignItems : 'center',
    justifyContent : 'center',
    //paddingTop: 0,
  },
  childcontainer2 : {
    //flex : 1,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'space-evenly',
    marginTop : 150,
  },
  childcontainer3 : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'flex-start',
    justifyContent : 'space-evenly'
  },
  input : {
    height : 40,
    width : '70%',
    backgroundColor : 'rgba(250,250,250,0)',
    marginBottom : 20,
    paddingHorizontal : 5,
    paddingBottom : 5,
    borderBottomWidth : 0.75,
    borderColor : 'black',
    color : 'white',
    alignSelf : 'center',
    fontSize : 15,
  },
  buttonContainer1 : {
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    width : '78%',
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
    //paddingVertical : 10,
    alignSelf : 'center'
  },
});
