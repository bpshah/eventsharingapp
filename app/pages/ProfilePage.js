import React, { Component } from 'react';
import { Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar, View, Dimensions, KeyboardAvoidingView, Picker} from 'react-native';
import { Avatar,CheckBox, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import ui from 'C:/Users/DELL/Documents/EventSharingSystem/app/utils/uploadImage.js';
import cfile from 'C:/Users/DELL/Documents/EventSharingSystem/app/utils/chooseFile.js';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';

export default class ProfilePage extends Component{

  constructor(props){
      super(props);
      this.state = {
        filePath : {},
        email : '',
        password : '',
        confirmPassword : '',
        firstname : '',
        lastName : '',
        date : '',
        mobileNumber : '',
        gender : '',
        location : '',
        imgsrc : '',
        errorMessage: null,
      }
      this.updateIndex = this.updateIndex.bind(this);
  }

  static navigationOptions = ({navigation}) => ({
      headerTitleStyle : {
         textAlign : 'justify',
         flex : 1,
         },
         headerStyle : {
           backgroundColor : Colors.tabBarColor,
         },
      title : 'My Profile',
      headerTintColor : Colors.white,
      /*headerRight : (
        <View marginRight = {10}>
          <Icon id = {1} name="check" size={20} color="#900" />
        </View>
      ),*/
      headerLeft : (
        <View marginLeft = {10}>
          <Icon name="angle-left" size={30} color={Colors.white} onPress={() => navigation.navigate('Events')}/>
        </View>
      )
  });

  componentWillMount(){

    let user = firebase.auth().currentUser;
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
        //console.log("In read :" + this.setState.imgsrc);
      });
    //console.log("After Read");
    }

  /*shouldComponentUpdate(nextProps){
    return nextState.filePath != this.state.filePath;
  }

  componentWillUpdate(){
    if(this.shouldComponentUpdate()){
      let fp = chooseFile();
      this.setState({
        filePath : fp,
      })
    }
  }*/

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
              filePath : source.path,
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
  let birthdate = this.state.date;
  let gender = this.state.gender;
  let location = this.state.location;
  let imgsrc = this.state.imgsrc;

  console.log("Before Update");

  //console.log(temail);
  firebase.database().ref('Users/' + temail).update({firstname,lastname,birthdate,mobileno,gender,location,imgsrc});
  console.log("Updated");
};

  updateDP = () => {
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    //console.log("In DP:");
    console.log("FilePath : " + this.state.filePath);
    ui.uploadImage(this.state.filePath,temail + '.png').then( () => { this.handleUpdate() });
    //console.log("T:" + timgsrc);
    /*this.setState({
      imgsrc : timgsrc,
    });*/
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  render(){
    const { selectedIndex } = this.state;
    return(
        <ScrollView contentContainerStyle = {styles.Container}
                    behaviour = 'height'
                    keyboardVerticalOffset = {64}
                    horizontal = {false}>
          <Avatar
              rounded
              source = {{uri : this.state.imgsrc }}
              showEditButton
              size = "xlarge"
              margin = {20}
              alignSelf = 'center'
              onEditPress = {this.chooseFile.bind(this)}
          />
          <TextInput style = {styles.input}
                title = 'First Name'
                placeholder = {this.state.firstname}
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = {firstname => this.setState({ firstname })}
                value = {this.state.firstname}
                autoFocus = {false}
                //clearTextOnFocus = {true}
          />
          <TextInput style = {styles.input}
                placeholder = {this.state.lastName}
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = {lastName => this.setState({ lastName })}
                value = {this.state.lastName}
          />
          <DatePicker
                style = {{height : 40,width : '80%',marginBottom : 20,alignSelf : 'center',backgroundColor : Colors.white,}}
                date = {this.state.date}
                mode = "datetime"
                placeholder = ""
                placeholderTextColor = 'rgba(255,255,255,0.7)'
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
              <Picker.Item label = 'Female' value = 'female'/>
              <Picker.Item label = 'Male' value = 'male'/>
              <Picker.Item label = 'Other' value = 'other'/>
          </Picker>
          <TextInput style = {styles.input}
                placeholder = {this.state.mobileNumber}
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                keyBoardType = 'phone-pad'
                autoCapitalize = 'none'
                autoCorrect = {false}
                dataDetectorTypes = 'phoneNumber'
                maxLength = {13}
                onChangeText = {mobileNumber => this.setState({ mobileNumber })}
                value = {this.state.mobileNumber}
          />
          <TextInput style = {styles.input}
                placeholder = {this.state.location}
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = {location => this.setState({ location })}
                value = {this.state.location}
          />
          <TextInput style = {styles.input}
                placeholder = {this.state.email}
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = {email => this.setState({ email })}
                value = {this.state.email}

          />
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
    height : 725,
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
    paddingHorizontal : 15,
    color : Colors.inputColor,
    borderBottomColor : Colors.borderColor,
    borderBottomWidth : 1,
  },
  buttonContainer : {
    //position: 'absolute',
    backgroundColor : Colors.backgroundColor,
    paddingVertical : 20,
    bottom : 5,
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
