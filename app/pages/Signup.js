import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar, ScrollView, Picker, Platform, Alert} from 'react-native';
import {BackHandler} from 'react-native';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';
import Icon from 'react-native-vector-icons/FontAwesome5.js';


export default class Signup extends Component {

  constructor(){
    super()
    this.state = {
      filePath : '',
      email : 'bhumit1206@gmail.com',
      password : 'asdf1234',
      confirmPassword : 'asdf1234',
      firstname : 'Bhumit',
      lastName : 'Shah',
      mobileNumber : '7359705973',
      location : 'Ahmedabad',
      imgsrc : '',
      errorMessage: null,
    }
  }

/* switch (error.code) {
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
*/
  handleSignUp = () => {
    //if(pwd.length >= 8 ){
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate('Events'))
        .catch(error => { console.log(error);})
      console.log("Sign");
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
        .set({ firstname, lastname, mobileno, location , imgsrc})
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
      ImagePicker.showImagePicker( response => {
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
      console.log("Signed Up");
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
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'First Name'
              placeholder = {this.state.firstname}
              placeholderTextColor = 'black'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {firstname => this.setState({ firstname })}
              value = {this.state.firstname}
              autoFocus = {false}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              placeholder = {this.state.lastName}
              placeholderTextColor = 'black'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {lastName => this.setState({ lastName })}
              value = {this.state.lastName}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="phone"
              size={22}
              color='black'
              style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              placeholder = {this.state.mobileNumber}
              placeholderTextColor = 'black'
              returnKeyType = 'next'
              keyBoardType = 'phone-pad'
              autoCapitalize = 'none'
              autoCorrect = {false}
              dataDetectorTypes = 'phoneNumber'
              maxLength = {13}
              onChangeText = {mobileNumber => this.setState({ mobileNumber })}
              value = {this.state.mobileNumber}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="map-marker-alt"
              size={22}
              color='black'
              style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              placeholder = {this.state.location}
              placeholderTextColor = 'black'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {location => this.setState({ location })}
              value = {this.state.location}/>
        </View>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="envelope"
            size={22}
            color='black'
            style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            placeholder = {this.state.email}
            placeholderTextColor = 'black'
            returnKeyType = 'next'
            keyBoardType = 'email-address'
            autoCapitalize = 'none'
            autoCorrect = {false}
            onChangeText = {email => this.setState({ email })}
            value = {this.state.email}/>
        </View>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="lock"
            size={22}
            color='black'
            style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            placeholder = 'Password'
            secureTextEntry = {true}
            returnKeyType = 'go'
            placeholderTextColor = 'rgba(255,255,255,0.7)'
            minLength = {8}
            blurOnSubmit = {true}
            onChangeText = {password => this.setState({ password })}
            value = {this.state.password}/>
        </View>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="lock"
            size={22}
            color='black'
            style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            placeholder = 'Confirm Password'
            secureTextEntry = {true}
            returnKeyType = 'go'
            placeholderTextColor = 'rgba(255,255,255,0.7)'
            minLength = {20}
            blurOnSubmit = {true}
            onChangeText = {confirmPassword => this.setState({ confirmPassword })}
            value = {this.state.confirmPassword}/>
        </View>

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
    backgroundColor : Colors.primaryAppColor,
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent : 'flex-start',
    height : 675,
    width : '100%'
    //width: 100,
    //height: 100,
  },
  input : {
    height : 40,
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : '2%',
    alignSelf : 'center',
    width : '80%',
    paddingHorizontal : '3%',
    paddingVertical : 0,
    borderBottomWidth : 0.75,
    color : Colors.white
  },
  buttonContainer : {
    //position: 'absolute',
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 20,
    bottom : 5,
    marginTop : '3%',
    alignSelf : 'stretch',
    width : '80%',
    alignSelf : 'center',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
});
