import React, { Component } from 'react';
import {  Button,
          TextInput,
          ScrollView,
          StyleSheet,
          TouchableOpacity,
          AsyncStorage,
          Text,
          FlatList,
          StatusBar,
          View,
          Dimensions,
          KeyboardAvoidingView,
          Picker,
          ActivityIndicator,
          ToastAndroid } from 'react-native';
import {  Avatar,
          CheckBox,
          ButtonGroup } from 'react-native-elements';
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
        categories : [],
        checked : [],
        cats : [],
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

    this.getCategories().then(() => {
      this.getUserProfileData().then(() => {
        this.mapCurrentInterests();
      })
    })
    .then(() => {
      this.setState({
        loading : false,
      })
    })
  }

  /*componentDidMount(){
    this.mapCurrentInterests();
  }*/

  // function to fetch categories of event from database
  getCategories = async () => {
    await firebase
      .database()
      .ref('Catgory/')
      .once('value').then((snapshot) => {
        //console.log("Before Parsing Categories");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //console.log("Category : " + item);
            this.state.categories.push(item);
        });
        console.log("Data 2 : " + this.state.categories);
      })
      .then(() => {
        let check = [];
        this.state.categories.forEach((item) => {
          check.push(false);
        })
        this.setState({
          checked : check,
        })
        //console.log("Data 2 : " + this.state.checked);
      })
  }

  // function to fetch user data from database
  getUserProfileData = async () => {
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');

    await firebase
      .database()
      .ref('Users/')
      .child(temail1)
      .once('value').then( (snapshot) => {
        //console.log(snapshot.val());
        this.setState({
          firstname : snapshot.val().firstname,
          lastName : snapshot.val().lastname,
          mobileNumber : snapshot.val().mobileno,
          date : snapshot.val().birthdate,
          gender : snapshot.val().gender,
          email : user.email,
          location : snapshot.val().location,
          imgsrc : snapshot.val().imgsrc,
          cats : snapshot.val().tcats,
          filePath : snapshot.val().imgsrc,
        })
      }).then( () => {
        this.setState({
          loading : false,
        })
        //console.log("Initial " + this.state.cats);
      });
  }

  // function upload profile image of user to storage
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

  // function to choose image file from storage
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
              imgsrc : response.uri,
            });
            console.log("In chooseFile " + this.state.imgsrc);
          }
        });
    };

  // function to map checkbox value to array
  mapCheckBox = () => {
    let cats = [];
    this.state.categories.forEach((cat) => {
      if(this.state.checked[this.state.categories.indexOf(cat)] === true){
        cats.push(this.state.categories[this.state.categories.indexOf(cat)]);
      }
    })
    return cats;
  }

  mapCurrentInterests = () => {

    let check = this.state.checked;
    this.state.cats.forEach((item) => {
      if(this.state.categories.includes(item)){
        check[this.state.categories.indexOf(item)] = true;
      }
    })
    this.setState({
      checked : check,
    })
    console.log("check : " + this.state.checked);
  }

  // function to upload user details to database
  handleUpdate = () => {

  let user = firebase.auth().currentUser;

  const email = user.email;
  const temail = email.slice(0,user.email.indexOf('@'));
  let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');
  //console.log("Before Uploading");

  let firstname = this.state.firstname;
  let lastname = this.state.lastName;
  let mobileno = this.state.mobileNumber;
  let location = this.state.location;
  let imgsrc = this.state.imgsrc;
  let tcats = this.mapCheckBox();

  console.log("Before Update");

  //console.log(temail);
  if(tcats.length > 0){
    firebase.database().ref('Users/' + temail1).update({firstname,lastname,tcats,mobileno,location,imgsrc})
    .then(() => {
      this.props.navigation.navigate('Events')
    });
    console.log("Updated");
  }
  else{
    ToastAndroid.showWithGravity( 'At least one Interestes is necessary.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
  }
};

  // routines for updating profile of user
  updateDP = () => {
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');
    //console.log("In DP:");
    //console.log("FilePath : " + this.state.filePath);
    if(this.state.firstname != '' &&
      this.state.lastName != '' &&
      this.state.mobileNumber != '' &&
      this.state.location != '' &&
      this.state.email != ''){
      this.setState({
        loading : true,
      })
        if(this.state.imgsrc != this.state.filePath){
          console.log("In updateDP " + this.state.imgsrc);
          this.uploadImage(this.state.imgsrc,temail1 + '.png')
              .then( () => { this.setState({
                                    loading : false,
                                    //filePath : '',
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
              autoCapitalize = 'words'
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
              autoCapitalize = 'words'
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
              autoCapitalize = 'words'
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
              autoCapitalize = 'words'
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
            autoCapitalize = 'words'
            autoCorrect = {false}
            onChangeText = {email => this.setState({ email })}
            ref = { input => {
              this.inputs['five'] = input;
            }}
            value = {this.state.email}/>
        </View>
        <Text style = {{alignSelf : 'flex-start',paddingTop : '1%',paddingBottom : '1%',marginBottom : '2%',marginTop : '4%',marginRight : '8%',marginLeft : '12%',fontSize : 16}}>Interestes : </Text>
        <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'flex-start',marginTop : '1%',marginLeft : '8%',
        flexWrap: 'wrap'}}>
        {
          this.state.categories.map((item,index) => {
          //console.log(item + "+" + index)
          return (
            <CheckBox
              title = {item}
              checked = {this.state.checked[index]}
              onPress = {() => {
                let check = this.state.checked
                check[index] = !check[index]
                this.setState({
                  checked : check
                })
                //console.log("State : ", this.state.checked);
              }}
              containerStyle = {{backgroundColor : Colors.primaryBackGourndColor,borderWidth : 0,padding : 0}}
            />
        )
        })}
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
    height : 800,
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
