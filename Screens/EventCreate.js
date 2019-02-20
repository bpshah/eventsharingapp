import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import ImagePicker from 'react-native-image-picker';
//import ImageSlider from 'react-native-image-slider';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker'


const options = {
  title : 'Add Picture',
  chooseFromLibraryButtonTitle : 'Select from Library',
}

export default class EventCreate extends Component{

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'justify',
       flex : 1,
       },
    title : 'New Event',
    //swipeEnabled : false,
    //tabBarVisible : false,
    /*headerRight : (
      <View marginRight = {10}>
        <Icon id = {1} name="check" size={20} color="#900" onPress = {this.handle}/>
      </View>

    ),*/
    headerLeft : (
      <View marginLeft = {10}>
        <Icon name="angle-left" size={30} color="#900" onPress={() => navigation.navigate('Events')}/>
      </View>
    )
  })

  constructor(props){
    super(props);
    this.state= {
      avatarSource : null,
      filePath : '',
      time : '',
      place : '',
      organizer : '',
      contact : '',
      description : '',
      name : '',
    };
  }

  uploadImage = (uri, imageName, mime = 'image/png') => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    return new Promise((resolve, reject) => {
      //const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const uploadUri = uri;
        let uploadBlob = null
        const imageRef = firebase.storage().ref('events').child(this.state.name).child(imageName)
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
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  selectPhotoTapped() {
      const options = {
        quality : 1.0,
        maxWidth : 500,
        maxHeight : 500,
        storageOptions : {
          skipBackup : true
        }
      }
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
            });
          }
        });
    };

  handleEvent = () => {
      let time = this.state.time;
      let place = this.state.place;
      let mobileno = this.state.contact;
      let description = this.state.description;
      let name = this.state.organizer;
      let eventname = this.state.name;

      firebase
        .database()
        .ref('Events/' + name)
        .set({ time, place, mobileno, description, name,eventname})
        .then(() => this.props.navigation.navigate('Events'))
        .catch(error => this.setState({ errorMessage: error.message }))
    }

  handle = () => {
    this.uploadImage(this.state.filePath, this.state.name + '.png');
    this.handleEvent();
  }

  render(){

    return(
      <ScrollView contentContainerStyle = {styles.container}
                  scrollEnabled = {true}
                  keyboardDismissMode = 'none'>
          <Avatar
            rectangle
            source = {{uri: this.state.filePath}}
            showEditButton
            height = {175}
            width = '80%'
            margin = {30}
            alignSelf = 'center'
            imageProps = {{resizeMode : 'stretch'}}
            editButton = {{size : 40}}
            onEditPress = {this.chooseFile.bind(this)}
          />
          <TextInput style = {styles.input}
                title = 'Event Name'
                placeholder = 'Name of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = { eventname => this.setState({ eventname })}
                value = {this.state.eventname}
          />
          <DatePicker
                style = {{height : 40,width : '80%',marginBottom : 20,alignSelf : 'center',backgroundColor : 'rgba(255,255,255,0.2)',}}
                date = {this.state.time}
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
                onDateChange = {(time) => {this.setState({date : time})}}
          />
          <TextInput style = {styles.input}
                title = 'Place'
                placeholder = 'Place of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                autoCapitalize = 'none'
                autoCorrect = {false}
                value={this.state.text}
                onChangeText = { place => this.setState({ place })}
                value = {this.state.place}
          />
          <TextInput style = {styles.input}
                title = 'Organizer Name'
                placeholder = 'Organizer of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = { organizer => this.setState({ organizer })}
                value = {this.state.organizer}
          />
          <TextInput style = {styles.input}
                title = 'Contact'
                placeholder = 'Contact of Organizer'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                nChangeText = { contact => this.setState({ contact })}
                value = {this.state.contact}

          />
          <TextInput style = {styles.input}
                title = 'Description'
                placeholder = 'Description of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                multiline = {true}
                autoCapitalize = 'none'
                autoCorrect = {false}
                onContentSizeChange={(event) => {
                    this.setState({height: event.nativeEvent.contentSize.height});
                  }}
                  onChangeText = { description => this.setState({ description })}
                  value = {this.state.description}
          />
          <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {this.handle}>

                <Text style = {styles.buttonText}>Create Event</Text>
          </TouchableOpacity>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : '#E96A69',
    flexDirection : 'column',
    alignItems: 'flex-start',
    justifyContent : 'flex-start',
    height : 675,
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
  ImageContainer: {
      flex : 45,
      borderColor: '#9B9B9B',
      borderWidth: 1 / PixelRatio.get(),
      //borderRadius : 150/2,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems : 'center',
      backgroundColor: '#FFFFFF',
      marginBottom : 25,
      marginTop : 25,
      width : '80%',
      aspectRatio : 1/1,
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
  })
