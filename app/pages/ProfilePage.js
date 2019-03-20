import React, { Component } from 'react';
import { Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar, View, Dimensions, KeyboardAvoidingView, Picker, ActivityIndicator, ToastAndroid} from 'react-native';
import { Avatar,CheckBox, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import Colors from '../styles/colors.js';
import Loader from '../components/loader.js'

export default class ProfilePage extends Component{

  constructor(props){
      super(props);
      this.state = {
        filePath : '',
        email : '',
        firstname : '',
        lastName : '',
        mobileNumber : '',
        location : '',
        imgsrc : '',
        errorMessage: null,
        loading : false,
      }
      this.focusNextField = this.focusNextField.bind(this);
      this.inputs = {};
  }

  static navigationOptions = ({navigation}) => ({
      headerTitleStyle : {
         textAlign : 'justify',
         flex : 1,
         fontSize : 20,
         },
         headerStyle : {
           backgroundColor : Colors.tabBarColor,
         },
      //header : null,
      title : 'My Profile',
      headerTintColor : Colors.white,
      /*headerRight : (
        <View marginRight = {10}>
          <Icon id = {1} name="check" size={20} color="#900" />
        </View>
      ),*/
      headerLeft : (
        <View marginLeft = {10}>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Icon1 name="ios-arrow-back" size={25} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )
  });

  componentWillMount(){

    let user = firebase.auth().currentUser;
    this.setState({
      loading : true,
    })
    //console.log(user);
    //let firstname,lastname,birthdate,mobileno,gender,email,password;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    //console.log(temail);
    firebase
      .database()
      .ref('Users/')
      .child(temail)
      .once('value').then( (snapshot) => {
        console.log(snapshot.val());
        this.setState({
          firstname : snapshot.val().firstname,
          lastName : snapshot.val().lastname,
          mobileNumber : snapshot.val().mobileno,
          date : snapshot.val().birthdate,
          gender : snapshot.val().gender,
          email : user.email,
          location : snapshot.val().location,
          imgsrc : snapshot.val().imgsrc,
        })
      }).then( () => {
        this.setState({
          loading : false,
        })
      });
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
        ImagePicker.showImagePicker(response => {
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

  handleUpdate = () => {

  let user = firebase.auth().currentUser;

  const email = user.email;
  const temail = email.slice(0,user.email.indexOf('@'));
  //console.log("Before Uploading");

  let firstname = this.state.firstname;
  let lastname = this.state.lastName;
  let mobileno = this.state.mobileNumber;
  let location = this.state.location;
  let imgsrc = this.state.imgsrc;

  console.log("Before Update");

  //console.log(temail);
  firebase.database().ref('Users/' + temail).update({firstname,lastname,mobileno,location,imgsrc})
  .then(() => {
    this.props.navigation.navigate('Events')
  });
  console.log("Updated");
};

  updateDP = () => {
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    console.log("In DP:");
    console.log("FilePath : " + this.state.filePath);
    if(this.state.firstname != '' &&
      this.state.lastName != '' &&
      this.state.mobileNumber != '' &&
      this.state.location != '' &&
      this.state.email != ''){
      this.setState({
        loading : true,
      })
        if(this.state.filePath != ''){
          this.uploadImage(this.state.filePath,temail + '.png')
              .then( () => { this.setState({
                                    loading : false,
                                    filePath : '',
                                    });
                                    this.handleUpdate() });
        }
        else {
          this.setState({
            loading : false,
          })
          this.handleUpdate();
        }
    }
    else {
      ToastAndroid.showWithGravity( 'All Fields are compulsory.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
    }
    console.log("After Update");
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  render(){
    const { selectedIndex } = this.state;

    return(
        <ScrollView contentContainerStyle = {styles.Container}>

          <Avatar
              rounded
              source = {{uri : this.state.imgsrc }}
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
              placeholder = {this.state.lastName}
              placeholderTextColor = 'black'
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
              placeholder = {this.state.mobileNumber}
              placeholderTextColor = 'black'
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
              placeholder = {this.state.location}
              placeholderTextColor = 'black'
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
            placeholder = {this.state.email}
            placeholderTextColor = 'black'
            returnKeyType = 'next'
            keyBoardType = 'email-address'
            autoCapitalize = 'none'
            autoCorrect = {false}
            onChangeText = {email => this.setState({ email })}
            ref = { input => {
              this.inputs['five'] = input;
            }}
            value = {this.state.email}/>
        </View>
        <TouchableOpacity style = {styles.buttonContainer}
                          onPress = {this.updateDP}>
              <Text style = {styles.buttonText}>Profile Ok</Text>
        </TouchableOpacity>

      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  Container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent : 'flex-start',
    //height : 610,
    width : '100%'
  },
  childContainer1 : {
    height : '25%',
    width : '30%',
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor : Colors.white,
    borderRadius : 200/2,
    marginLeft : 10,
    marginRight : 10,
    marginTop : 10,
    marginBottom : 30,
    width : '50%',
  },
  childContainer2 : {
    //flex : 50 ,
    flexDirection : 'column',
    alignSelf : 'center',
    justifyContent : 'flex-start',
    backgroundColor : Colors.tabBarColor,
    marginLeft : 15,
    marginRight : 10,
    marginTop : 10,
    marginBottom : 20,
    //height : '75%',
    width : '100%'
    //flexGrow : 1,
  },
  input : {
    height : 40,
    width : '80%',
    alignSelf : 'center',
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : 20,
    paddingHorizontal : 10,
    color : Colors.inputColor,
    borderBottomColor : Colors.borderColor,
    borderBottomWidth : 1,
  },
  buttonContainer : {
    //position: 'absolute',
    backgroundColor : Colors.primaryBackGourndColor,
    paddingVertical : 20,
    bottom : 5,
    marginLeft : '2%',
    alignSelf : 'center',
    width : '80%',

  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    fontWeight : '700',
    color : 'white',
  },
});
