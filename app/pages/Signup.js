import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar, ScrollView, Picker, Platform, Alert} from 'react-native';
import {BackHandler} from 'react-native';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';

export default class Signup extends Component {

  constructor(){
    super()
    this.state = {
      filePath : '',
      email : 'bhumit1206@gmail.com',
      password : 'asdf1234',
      confirmPassword : 'asdf1234',
      firstname : '',
      lastName : '',
      date : '',
      mobileNumber : '',
      selectedIndex : 1,
      gender : '',
      location : '',
      imgsrc : '',
      errorMessage: null,
    }
    const button = ['Male', 'Female','Other'];
  }

  handleSignUp = () => {
    //if(pwd.length >= 8 ){
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate('Events'))
        .catch(error => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              console.log(`Email address ${this.state.email} already in use.`);
            case 'auth/invalid-email':
              console.log(`Email address ${this.state.email} is invalid.`);
            case 'auth/operation-not-allowed':
              console.log(`Error during sign up.`);
            case 'auth/weak-password':
              console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
            default:
              console.log(error.message);
        }
      })
  }

  uploadImage = (uri, imageName, mime = 'image/png') => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    return new Promise((resolve, reject) => {
        //const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const uploadUri = uri;
        let uploadBlob = null;
        const imageRef = firebase.storage().ref('images').child(imageName);
        //console.log("In UI : " + uploadUri + imageName);
        fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(uri, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          this.setState({
            imgsrc : url,
          });
          console.log("In Ui :" + this.state.imgsrc);
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        });

    })
  }

  handleProfileData = () => {
      let firstname = this.state.firstname;
      let lastname = this.state.lastName;
      let mobileno = this.state.mobileNumber;
      let birthdate = this.state.date;
      let gender = this.state.gender;
      let email = this.state.email;
      let location = this.state.location;
      let imgsrc = this.state.imgsrc;

      let temail = email.slice(0,email.indexOf('@'));

      //let url = firebase.storage().ref('images/' + temail + '.png').getDownloadURL();
      //let imgUrl = url;

      console.log("IMGURL:" + imgsrc);

      firebase
        .database()
        .ref('Users/' + temail)
        .set({ firstname, lastname, mobileno, birthdate, gender, location , imgsrc})
        .catch(error => this.setState({ errorMessage: error.message }))

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
            filePath : response.uri,
            imageHeight : response.height,
            imageWidth : response.width,
          });

        }
      });
  };

  handle = () => {

    console.log("In handle");
    const { password, confirmPassword } = this.state;
    let email = this.state.email;
    let temail = email.slice(0,email.indexOf('@'));

    if(password !== confirmPassword ){
      Alert("Password don't match");
      console.log("Password don't match");
    }
    else {
        this.uploadImage(this.state.filePath, temail + '.png')
        .then(() => { this.handleProfileData(); });
        this.handleSignUp();
    }
  }

  render(){

    const { selectedIndex } = this.state
    return(
      <ScrollView contentContainerStyle = {styles.container}>
        <StatusBar barStyle = 'light-content'/>
          <Avatar
            rounded
            source = {{uri: this.state.filePath}}
            showEditButton
            size = "xlarge"
            margin = {20}
            alignSelf = 'center'
            onEditPress = {this.chooseFile.bind(this)}
          />
        <TextInput style = {styles.input}
              title = 'First Name'
              placeholder = 'First Name'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {firstname => this.setState({ firstname })}
              value = {this.state.firstname}
              autoFocus = {true}
              blurOnSubmit = {true}
              //clearTextOnFocus = {true}
        />
        <TextInput style = {styles.input}
              placeholder = 'Last Name'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              blurOnSubmit = {true}
              onChangeText = {lastName => this.setState({ lastName })}
              value = {this.state.lastName}
        />
        <DatePicker
              style = {{height : 40,width : '80%',marginBottom : 20,alignSelf : 'center',backgroundColor : 'rgba(255,255,255,0.2)',}}
              date = {this.state.date}
              mode = "date"
              placeholder = "Select Your Birthdate"
              format = "DD-MM-YYYY"
              minDate = "01-01-1950"
              maxDate = "01-01-2020"
              confirmBtnText = "Confirm"
              cancelBtnText = "Cancel"
              customStyles = {{
                dateIcon : {
                  position : 'absolute',
                  left : 292,
                  top : 4,
                  marginLeft : 0
                },
                dateInput : {
                  marginRight : 44
                }
              }}
              onDateChange = {(date) => {this.setState({date : date})}}
        />
        <Picker
            selectedValue = {this.state.gender}
            style = {styles.input}
            itemStyle = {{fontSize : 12,paddingHorizontal : 15,}}
            mode = 'dropdown'
            onValueChange = {(itemValue, itemIndex) => this.setState({gender : itemValue})}>
            <Picker.Item label = 'Male' value = 'male'/>
            <Picker.Item label = 'Female' value = 'female'/>
            <Picker.Item label = 'Other' value = 'other'/>
        </Picker>
        <TextInput style = {styles.input}
              placeholder = 'Mobile Number'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              keyBoardType = 'phone-pad'
              autoCapitalize = 'none'
              autoCorrect = {false}
              dataDetectorTypes = 'phoneNumber'
              maxLength = {13}
              blurOnSubmit = {true}
              onChangeText = {mobileNumber => this.setState({ mobileNumber })}
              value = {this.state.mobileNumber}
        />
        <TextInput style = {styles.input}
              placeholder = 'City'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              blurOnSubmit = {true}
              onChangeText = {location => this.setState({ location })}
              value = {this.state.location}
        />
        <TextInput style = {styles.input}
              placeholder = 'Email'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              keyBoardType = 'email-address'
              autoCapitalize = 'none'
              autoCorrect = {false}
              blurOnSubmit = {true}
              onChangeText = {email => this.setState({ email })}
              value = {this.state.email}

        />
        <TextInput style = {styles.input}
              placeholder = 'Password'
              secureTextEntry = {true}
              returnKeyType = 'go'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              minLength = {8}
              blurOnSubmit = {true}
              onChangeText = {password => this.setState({ password })}
              value = {this.state.password}
        />
        <TextInput style = {styles.input}
              placeholder = 'Confirm Password'
              secureTextEntry = {true}
              returnKeyType = 'go'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              minLength = {20}
              blurOnSubmit = {true}
              onChangeText = {confirmPassword => this.setState({ confirmPassword })}
              value = {this.state.confirmPassword}
        />
        <TouchableOpacity style = {styles.buttonContainer}
                          onPress = {this.handle}>
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
