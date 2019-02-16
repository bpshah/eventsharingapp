import React, { Component } from 'react';
import { Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar, View, Dimensions, KeyboardAvoidingView, Picker} from 'react-native';
import { Avatar,CheckBox, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';

export  default class ProfilePage extends Component{

  static navigationOptions = ({navigation}) => ({
      headerTitleStyle : {
         textAlign : 'center',
         flex : 1,
         },
      title : 'My Profile',
      headerRight : (
        <View marginRight = {10}>
          <Icon id = {1} name="check" size={20} color="#900" onPress={() => navigation.navigate('Events')} />
        </View>
      ),
      headerLeft : (
        <View marginLeft = {10}>
          <Icon name="angle-left" size={30} color="#900" onPress={() => navigation.navigate('Events')}/>
        </View>
      )
  });

  constructor(){
      super();
      this.state = {
        filePath : '',
        email : '',
        password : '',
        confirmPassword : '',
        firstname : '',
        lastName : '',
        date : '',
        mobileNumber : '',
        selectedIndex : 1,
        gender : '',
        errorMessage: null,
      }
      this.updateIndex = this.updateIndex.bind(this)
  }

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
            filePath: source,
          });
        }
      });
  };

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  readUserData() {
    let user = firebase.auth().currentUser;
    let firstname,lastname,birthdate,mobileno,gender,email,password;

    if(user !== null){
      let temail = user.email.slice(0,user.email.indexOf('@'));
    }

    firebase.database().ref('Users/').on('value').then(function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let value = childSnapshot.val();
          console.log("Hello");
          this.setState({
            lastName : value.lastname,
        })
      });
    });
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
                autoFocus = {true}
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
              <Picker.Item label = 'Male' value = 'male'/>
              <Picker.Item label = 'Female' value = 'female'/>
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
    height : 750,
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
});


/*<ScrollView contentContainerStyle = {styles.Container}
            >
  <View style = {styles.childContainer1}>
    <Icon id = {1} name="plus" size={20} color="#900" onPress={this.pickImageHandler}/>
  </View>

  <TextInput style = {styles.input}
          title = 'Username'
          placeholder = {this.state.usename}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />
    <TextInput style = {styles.input}
          title = 'firstname'
          placeholder = {this.state.firstname}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          //keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />
    <TextInput style = {styles.input}
          title = 'Lastname'
          placeholder = {this.state.lastname}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          //keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />
    <TextInput style = {styles.input}
          title = 'E-mail'
          placeholder = {this.state.email}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          //keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />
    <TextInput style = {styles.input}
          title = 'Gender'
          placeholder = {this.state.gender}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          //keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />
    <TextInput style = {styles.input}
          title = 'Mobile No.'
          placeholder = {this.state.mobileno}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          //keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />
    <TextInput style = {styles.input}
          title = 'Brithdate'
          placeholder = {this.state.birthdate}
          placeholderTextColor = 'rgba(255,255,255,0.7)'
          returnKeyType = 'next'
          //keyBoardType = 'email-address'
          autoCapitalize = 'none'
          autoCorrect = {false}
    />

</ScrollView>*/
