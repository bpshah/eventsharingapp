import React, { Component } from 'react';
import { Button, TextInput,NetInfo, View, StyleSheet, TouchableOpacity, Text, StatusBar, ScrollView, Picker, Platform, Alert,AsyncStorage,ToastAndroid} from 'react-native';
import {BackHandler} from 'react-native';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import Colors from '../styles/colors.js';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Loader from '../components/loader.js'

export default class Signup extends Component {

  constructor(props){
    super(props)
    this.state = {
      filePath : '',
      email : 'bhumit1234@gmail.com',
      password : 'asdf1234',
      confirmPassword : 'asdf1234',
      firstname : 'bhumit',
      lastName : 'shah',
      mobileNumber : '7359705973',
      location : 'Ahmedabad',
      imgsrc : '',
      errorMessage: null,
      token : '',
      loading : false,
      isConnected : true,
      from : this.props.navigation.state.params.from,
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentWillMount(){
    if(this.state.from){
      this.setState({
        firstname : this.props.navigation.state.params.firstName,
        lastName : this.props.navigation.state.params.lastName,
        imgsrc : this.props.navigation.state.params.imgsrc,
        //email : this.props.navigation.navigate.params.email
      });
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('token').then(token => {
      //console.log("Token Signup :" + token);
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
      this.setState({
        token : token,
      });
      //console.log("State : " + this.state.token);
    })
  }

  componentWillUnmount(){
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      console.log("in if connectionChange");
      this.setState({ isConnected : true});
    } else {
      console.log("in else connectionChange");
      this.setState({ isConnected : false});
    }
  }

  handleSignUp = async () => {
    //if(pwd.length >= 8 ){
    let email = this.state.email
    let password  = this.state.password
    console.log("in sign up");
    if(email != '' && password != ''){
      console.log("in if");

      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, password)
        .then(() => {
          firebase.auth().currentUser.sendEmailVerification().then(() => {
                console.log("Email verification link sent");
            }).catch((error) => {
              console.log(error);
            })
          //this.props.navigation.navigate('Login')
        })
        .catch(error => {
          console.log(error);
          switch(error.code){
            case 'auth/email-already-in-use':
              ToastAndroid.showWithGravity( 'Email is already in use.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
              break;
            case 'auth/invalid-email':
              ToastAndroid.showWithGravity( 'Email is invalid.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
              break;
            case 'auth/operation-not-allowed':
              ToastAndroid.showWithGravity( ' Error signing up',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
              break;
            case 'auth/weak-password':
              ToastAndroid.showWithGravity( 'Password is weak',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
              break;
            default:
              ToastAndroid.showWithGravity( 'Error signing up',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
          }
        })
    }
    else{
      ToastAndroid.showWithGravity( 'Email and Password Fields cannot be empty',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
    }
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
          console.log("Image Uploaded");
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          //console.log("Before setState");
          console.log("url :" + url);
          this.setState({
            imgsrc : url,
          });
          /*let imgsrc = this.state.imgsrc;
          console.log("In UI :" + this.state.imgsrc);
          let temail = this.state.email.slice(0,this.state.email.indexOf('@'));
          console.log("Imgsrc : " + imgsrc);
          firebase
            .database()
            .ref('Users/'+ temail)
            .update({imgsrc});*/
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        });

    })
  }

  handleProfileData = () => {

      console.log("In profile data");
      let firstname = this.state.firstname;
      let lastname = this.state.lastName;
      let mobileno = this.state.mobileNumber;
      let email = this.state.email;
      let location = this.state.location;
      let imgsrc = this.state.imgsrc;
      let token = this.state.token;

      let temail = email.slice(0,email.indexOf('@'));
      let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');

      firebase
        .database()
        .ref('Users/' + temail1)
        .set({ firstname, lastname, mobileno, location , token, imgsrc})
        .then(() => {
          this.props.navigation.navigate("Interested",{
              email : this.state.email,
          });
        })
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
        //console.log('Response = ', response);

        if (response.didCancel) {

          //console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          let source = response;
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            filePath : response.uri,
          });
          //console.log(this.state.filePath);
        }
      });
  };

  handle = () => {

    console.log("In handle");
    const { password, confirmPassword } = this.state;
    let email = this.state.email;
    let temail = email.slice(0,email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');

    if(password != confirmPassword ){
      ToastAndroid.showWithGravity( "Passwords don't match",ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
    }
    else {
      if(this.state.firstname != ''
      && this.state.lastName != ''
      && this.state.mobileNumber != ''
      && this.state.location != ''
      && this.state.email != ''
      && this.state.password != ''
      && this.state.confirmPassword != ''){
        if(this.state.filePath != ''){
          if(this.state.isConnected){
            this.setState({
              loading : true,
            })
          }
          else{
            this.setState({
              loading : false,
            })
            ToastAndroid.showWithGravity( 'Please connect to internet.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
          }
          this.handleSignUp()
          .then(async () =>  {
            await this.uploadImage(this.state.filePath, temail1 + '.png')
          })
          .then(() => {
            this.handleProfileData();
            this.setState({
              loading : false,
            })
          });
        }
        else{
          ToastAndroid.showWithGravity( 'Profile Picture is compulsory.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
        }
      }
      else {
        ToastAndroid.showWithGravity( 'All Fields and compulsory.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
      }
      console.log("Signed Up");
    }
  }

  fromState = () => {
    console.log("in fromState");
    if(this.state.from){
      console.log("in if ");
      return (  <TouchableOpacity style = {styles.buttonContainer}
                        onPress = {this.handleProfileData}>
                        <Text style = {styles.buttonText}>Submit</Text>
                </TouchableOpacity>
          )
    }
    else{
      console.log("in else");
      return (
        <TouchableOpacity style = {styles.buttonContainer}
                          onPress = {this.handle}>
              <Text style = {styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
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
            editButton = {{name : 'camera-alt', type : 'material', color : 'black', underlayColor : 'white'}}
            onEditPress = {this.chooseFile.bind(this)}
          />
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'First Name'
              placeholder = 'Your First Name'
              placeholderTextColor = {Colors.placeholderTextSignup}
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {firstname => this.setState({ firstname })}
              onSubmitEditing = { () => {
                this.focusNextField('two');
              }}
              ref = { input => {
                this.inputs['one'] = input;
              }}
              value = {this.state.firstname}
              autoFocus = {false}/>
          </View>
          <Loader loading = {this.state.loading}/>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              placeholder = 'Your Last Name'
              placeholderTextColor = {Colors.placeholderTextSignup}
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {lastName => this.setState({ lastName })}
              onSubmitEditing = { () => {
                this.focusNextField('three');
              }}
              ref = { input => {
                this.inputs['two'] = input;
              }}
              value = {this.state.lastName}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="phone"
              size={22}
              color='black'
              style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              placeholder = 'Your Mobile Number'
              placeholderTextColor = {Colors.placeholderTextSignup}
              returnKeyType = 'next'
              keyBoardType = 'phone-pad'
              autoCapitalize = 'none'
              autoCorrect = {false}
              dataDetectorTypes = 'phoneNumber'
              maxLength = {13}
              onChangeText = {mobileNumber => this.setState({ mobileNumber })}
              onSubmitEditing = { () => {
                this.focusNextField('four');
              }}
              ref = { input => {
                this.inputs['three'] = input;
              }}
              value = {this.state.mobileNumber}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="map-marker-alt"
              size={22}
              color='black'
              style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              placeholder = 'Your City'
              placeholderTextColor = {Colors.placeholderTextSignup}
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = {location => this.setState({ location })}
              onSubmitEditing = { () => {
                this.focusNextField('five');
              }}
              ref = { input => {
                this.inputs['four'] = input;
              }}
              value = {this.state.location}/>
        </View>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="envelope"
            size={22}
            color='black'
            style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            placeholder = 'Your Email'
            placeholderTextColor = {Colors.placeholderTextSignup}
            returnKeyType = 'next'
            keyBoardType = 'email-address'
            autoCapitalize = 'none'
            autoCorrect = {false}
            onChangeText = {email => this.setState({ email })}
            onSubmitEditing = { () => {
              this.focusNextField('six');
            }}
            ref = { input => {
              this.inputs['five'] = input;
            }}
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
            placeholderTextColor = {Colors.placeholderTextSignup}
            minLength = {8}
            blurOnSubmit = {true}
            onChangeText = {password => this.setState({ password })}
            onSubmitEditing = { () => {
              this.focusNextField('seven');
            }}
            ref = { input => {
              this.inputs['six'] = input;
            }}
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
            placeholderTextColor = {Colors.placeholderTextSignup}
            minLength = {20}
            blurOnSubmit = {true}
            onChangeText = {confirmPassword => this.setState({ confirmPassword })}
            ref = { input => {
              this.inputs['seven'] = input;
            }}
            value = {this.state.confirmPassword}/>
        </View>
        {this.fromState()}
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
