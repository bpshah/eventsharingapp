import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar, ScrollView} from 'react-native';
import {BackHandler} from 'react-native';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';


export default class Signup extends Component {

  constructor(){
    super()
    this.state = {
      selectedIndex : 1,
      date : '',
      filePath : {},
      email : '',
      password : '',
      username : '',
      lastName : '',
      mobileNumber : '',
      gender : 'Male',
      errorMessage: null,
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  handleProfileData = () => {
    var username = this.state.username;
    var lastname = this.state.lastName;
    var mno = this.state.mobileNumber;
    var date = this.state.date;
    var gen = this.state.gender;

    firebase
      .database()
      .ref('Users/' + this.username)
      .set({ username, lastname, mno, date, gen})
      .then(() => this.props.navigation.navigate('Events'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  handle = () => {
    this.handleProfileData();
    this.handleSignUp();
  }

  chooseFile = () => {
      var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          let source = response;
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            filePath: source,
          });
        }
      });
  };

  updateIndex(selectedIndex) {
    this.setState({selectedIndex})
  }
  render(){

    const buttons = ['Male', 'Female','Other']
    const { selectedIndex } = this.state
    return(
      <ScrollView contentContainerStyle = {styles.container}>
        <StatusBar barStyle = 'light-content'/>
          <Avatar
            rounded
            source={require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png')}
            showEditButton
            size="xlarge"
            margin = {20}
            alignSelf= 'center'
            onEditPress = {this.chooseFile.bind(this)}
          />
        <TextInput style = {styles.input}
              title = 'Username'
              placeholder = 'First Name'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
              //autoFocus = {true}
              //clearTextOnFocus = {true}
        />
        <TextInput style = {styles.input}
              placeholder = 'Last Name'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText={lastName => this.setState({ lastName })}
              value={this.state.lastName}
        />
        <DatePicker
              style={{height : 40,width : '80%',marginBottom : 20,alignSelf : 'center',backgroundColor : 'rgba(255,255,255,0.2)'}}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-1950"
              maxDate="01-01-2020"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left : 292,
                  top : 4,
                  marginLeft : 0
                },
                dateInput: {
                  marginRight: 44
                }
              }}
              onDateChange={(date) => {this.setState({date: date})}}
        />
        <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle= {styles.input}
        />
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
        <TextInput style = {styles.input}
              placeholder = 'Mobile Number'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              keyBoardType = 'phone-pad'
              autoCapitalize = 'none'
              autoCorrect = {false}
              dataDetectorTypes = 'phoneNumber'
              maxLength = {13}
              onChangeText={mobileNumber => this.setState({ mobileNumber })}
              value={this.state.mobileNumber}
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
        <TextInput style = {styles.input}
              placeholder = 'Repeat Password'
              secureTextEntry = {true}
              returnKeyType = 'go'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              maxLength = {20}
        />
        <TouchableOpacity style = {styles.buttonContainer}
        onPress={() => this.props.navigation.navigate('Login')}>

              <Text style = {styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.buttonContainer}
        onPress={this.handle}>

              <Text style = {styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : '#E96A69',
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent : 'flex-start',
    height : 850,
    width : '100%'
    //width: 100,
    //height: 100,
  },
  input : {
    height : 40,
    backgroundColor : 'rgba(255,255,255,0.2)',
    marginBottom : 20,
    alignSelf : 'center',
    width : '80%',
    paddingHorizontal : 15,
    paddingVertical : 0,
    color : '#FFF'
  },
  buttonContainer : {
    //position: 'absolute',
    backgroundColor : '#E96A69',
    paddingVertical : 20,
    bottom : 5,
    alignSelf : 'stretch',
    width : '80%',
    alignSelf : 'center',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : '#FFFFFF',
    paddingVertical : 15,
    fontWeight : '700'
  },
});
