import React, { Component } from 'react';
import { Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar, View, Dimensions, KeyboardAvoidingView, Picker} from 'react-native';
import { Avatar,CheckBox, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';


export default class ProfilePage extends Component{

  constructor(props){
      super(props);
      this.state = {
        filePath : '',
        email : '',
        password : '',
        confirmPassword : '',
        firstname : '',
        lastName : '',
        date : '',
        mobileNumber : '',
        gender : '',
        location : '',
        errorMessage: null,
      }
      this.updateIndex = this.updateIndex.bind(this)
  }

  static navigationOptions = ({navigation}) => ({
      headerTitleStyle : {
         textAlign : 'justify',
         flex : 1,
         },
      title : 'My Profile',
      /*headerRight : (
        <View marginRight = {10}>
          <Icon id = {1} name="check" size={20} color="#900" />
        </View>
      ),*/
      headerLeft : (
        <View marginLeft = {10}>
          <Icon name="angle-left" size={30} color="#900" onPress={() => navigation.navigate('Events')}/>
        </View>
      )
  });

  componentWillMount(){

    let user = firebase.auth().currentUser;
    console.log(user);
    let firstname,lastname,birthdate,mobileno,gender,email,password;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    console.log(temail);
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
        })
      });

      /*  firebase
        .storage()
        .ref('images/')
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          let imgUrl = JSON.stringify(url);
          this.setState({
              filePath :  imgUrl,
          })
        });*/
    //console.log('URL :'+ this.state.filePath);
  }

  handleUpdate = () => {

    let user = firebase.auth().currentUser;

    const email = user.email;

    let firstname = this.state.firstname;
    let lastname = this.state.lastName;
    let mobileno = this.state.mobileNumber;
    let birthdate = this.state.date;
    let gender = this.state.gender;
    let location = this.state.location;

    console.log("Before Update");
    const temail = email.slice(0,user.email.indexOf('@'));

    console.log(temail);
    firebase.database().ref('Users/' + temail).update({firstname,lastname,birthdate,mobileno,gender,location});
    console.log("Updated");
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({ screenHeight: contentHeight });
  };

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
            filePath : source,
          });
        }
      });
  };

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  render(){
    const buttons = ['Male', 'Female','Other']
    const { selectedIndex } = this.state
    return(
        <ScrollView contentContainerStyle = {styles.Container}
                    behaviour = 'height'
                    keyboardVerticalOffset = {64}
                    horizontal = {false}>
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
              <Picker.Item label = 'Female' value = 'male'/>
              <Picker.Item label = 'Male' value = 'female'/>
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
          <TextInput style = {styles.input}
                placeholder = {this.state.password}
                secureTextEntry = {true}
                returnKeyType = 'go'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                minLength = {8}
                onChangeText = {password => this.setState({ password })}
                value = {this.state.password}
          />
          <TextInput style = {styles.input}
                placeholder = {this.state.confirmPassword}
                secureTextEntry = {true}
                returnKeyType = 'go'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                minLength = {20}
                onChangeText = {confirmPassword => this.setState({ confirmPassword })}
                value = {this.state.confirmPassword}
          />
          <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {this.handleUpdate}>

                <Text style = {styles.buttonText}>Profile Ok</Text>
          </TouchableOpacity>
          </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  Container : {
    flexGrow : 1,
    backgroundColor : '#E96A69',
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent : 'flex-start',
    height : 850,
    width : '100%'
  },
  childContainer1 : {
    height : '25%',
    width : '30%',
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor : '#FFFFFF',
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
    backgroundColor : '#E96A69',
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
    backgroundColor : 'rgba(255,255,255,0.2)',
    marginBottom : 20,
    paddingHorizontal : 15,
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
