import React, { Component } from 'react';
import { Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar, View, Dimensions, KeyboardAvoidingView} from 'react-native';
import { Avatar,CheckBox, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import DatePicker from 'react-native-datepicker'

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
        usename : 'Bhumit',
        firstname : 'Bhumit',
        gender : 'Male',
        mobileno : '9824213232',
        email : 'sbhumit98@gmail.com',
        lastname : 'Shah',
        birthdate : '12/06/98',
        avatarSource : null,
        screenHeight: 0,
        selectedIndex : 1,
        date : "2019-01-01",
        filePath : {},
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

  render(){
    const buttons = ['Male', 'Female','Other']
    const { selectedIndex } = this.state
    return(
        <ScrollView contentContainerStyle = {styles.Container}
                    behaviour = 'height'
                    keyboardVerticalOffset = {64}
                    horizontal = {false}>
            <View style = {{margin : 20}}>
              <Avatar
                rounded
                source={require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png')}
                showEditButton
                size="xlarge"
                onEditPress = {this.chooseFile.bind(this)}
              />
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
              <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle= {styles.input}
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
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
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
    height : 625,
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
