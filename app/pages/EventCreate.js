import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import ImagePicker from 'react-native-image-picker';
//import ImageSlider from 'react-native-image-slider';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';


const options = {
  title : 'Add Picture',
  chooseFromLibraryButtonTitle : 'Select from Library',
}

export default class EventCreate extends Component{

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'justify',
       flex : 1,
       fontSize : 20,
     },
    title : 'New Event',
    headerStyle : {
      backgroundColor : Colors.primaryAppColor,
    },
    headerTintColor : Colors.white,
    //swipeEnabled : false,
    //tabBarVisible : false,
    /*headerRight : (
      <View marginRight = {10}>
        <Icon id = {1} name="check" size={20} color="#900" onPress = {this.handle}/>
      </View>

    ),*/
    headerLeft : (
      <View marginLeft = {10}>
        <Icon name="angle-left" size={25} color={Colors.white} onPress={() => navigation.navigate('Events')}/>
      </View>
    )
  })

  constructor(props){
    super(props);
    this.state = {
      avatarSource : null,
      filePath : '',
      eventname : '',
      place : '',
      organizer : '',
      contact : '',
      description : '',
      category : '',
      time : 'At 5:00 PM, Thu, 27-Feb 19',
      imgsrc : '',
      selectedValue : 0,
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
        const imageRef = firebase.storage().ref('events').child(this.state.eventname).child(imageName)
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
          console.log("Image Uploaded");
          this.setState({
            imgsrc : url,
          });
          console.log("In Ui :" + this.state.imgsrc);
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
              filePath : source.uri,
            });
          }
        });
    };

  handleEvent = () => {

      let user = firebase.auth().currentUser;

      const email = user.email;
      //const temail = email.slice(0,user.email.indexOf('@'));

      let time = this.state.time;
      let place = this.state.place;
      let mobileno = this.state.contact;
      let description = this.state.description;
      let org = this.state.organizer;
      let eventname = this.state.eventname;
      let category = this.state.category;

      let uid  = email.slice(0,user.email.indexOf('@'));
      console.log("Before Upload");
      firebase
        .database()
        .ref('Events/'+ this.state.eventname)
        .set({ eventname, place, org, mobileno, description,category,time,uid})
        .then(() => this.props.navigation.navigate('Events'))
        .catch(error => this.setState({ errorMessage: error.message }))
      console.log("Event Upload");
    }

  handle = () => {
    this.uploadImage(this.state.filePath, this.state.eventname + '.png').then(() => this.handleEvent());
    //this.handleEvent();
  }

  /*customStyles = {{
    dateIcon : {
      position : 'relative',
      left : 0,
      top : 0,
      right : 50,
      bottom : 20,
      marginLeft : 0,
      //borderColor : Colors.primaryBackGourndColor,
      borderBottomColor : Colors.primaryAppColor,
      borderBottomWidth : 1
    },
    dateInput : {
      marginRight : 44,
      borderBottomColor : 'black',
      borderBottomWidth : 1
    }
  }}*/
  /*<DatePicker
        style = {{height : 40,width : '80%',marginBottom : 20,alignSelf : 'center',backgroundColor : Colors.inputBackgroundColor,  borderBottomColor : 'black',
          borderBottomWidth : 1}}
        date = {this.state.time}
        mode = "date"
        placeholder = "Select Event Date"
        format = "DD-MM-YYYY"
        minDate = "01-01-1950"
        maxDate = "01-01-2020"
        confirmBtnText = "Confirm"
        cancelBtnText = "Cancel"

        onDateChange = {(time) => {this.setState({date : time})}}
  />*/

  render(){

    return(
      <ScrollView contentContainerStyle = {styles.container}
                  scrollEnabled = {true}
                  keyboardDismissMode = 'none'>
          <Avatar
            rectangle
            source = {{uri: this.state.filePath}}
            showEditButton
            //size = 'xlarge'
            height = {175}
            width = '80%'
            marginTop = '5%'
            marginLeft = '5%'
            alignSelf = 'center'
            backgroundColor = '#F2F2F2'
            //imageProps = {{resizeMode : 'contain'}}
            editButton = {{size : 30}}
            onEditPress = {this.chooseFile.bind(this)}
          />
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Event Name'
              placeholder = {this.state.eventname}
              //placeholderTextColor = 'black'
              returnKeyType = 'next'
              //keyBoardType = 'email-address'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = { eventname => this.setState({ eventname })}
              value = {this.state.eventname}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="map-marker-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Place'
              placeholder = 'Place of Event'
              //placeholderTextColor = 'black'
              returnKeyType = 'next'
              autoCapitalize = 'none'
              autoCorrect = {false}
              onChangeText = { place => this.setState({ place })}
              value = {this.state.place}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
              <Icon name="landmark"
                size={22}
                color='black'
                style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                title = 'Organizer Name'
                placeholder = 'Organizer of Event'
                //placeholderTextColor = 'black'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = { organizer => this.setState({ organizer })}
                value = {this.state.organizer}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
              <Icon name="phone"
                size={22}
                color='black'
                style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                title = 'Contact'
                placeholder = 'Contact of Organizer'
                //placeholderTextColor = 'black'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                onChangeText = { contact => this.setState({ contact })}
                value = {this.state.contact}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="scroll"
              size={22}
              color='black'
              style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '0.25%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Description'
              placeholder = 'Description of Event'
              //placeholderTextColor = 'black'
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
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%',marginBottom : '2%'}}>
            <Icon name="phone"
              size={22}
              color='black'
              style = {{marginLeft : '9%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <View style = {{ borderBottomColor : 'black',paddingHorizontal : 10,borderBottomWidth : 1,width : '80%',marginBottom : '2%',backgroundColor : 'rgba(255,255,255,0)',}}>
            <Picker
              selectedValue = {this.state.category}
              mode = 'dropdown'
              onValueChange = {(itemValue, itemIndex) =>
                this.setState({ category : itemValue,selectedValue : itemIndex})}>
              <Picker.Item label = "Event Category" value = "event" />
              <Picker.Item label = "Tech" value = "tech" />
              <Picker.Item label = "Cultural" value = "Cultural" />
            </Picker>
            </View>
          </View>
          <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {this.handle}>
              <Text style = {styles.buttonText}>Create Event</Text>
          </TouchableOpacity>

      </ScrollView>
    )
  }
}
/*<TextInput style = {styles.input}
  title = 'Event Category'
  placeholder = 'Event Category'
  placeholderTextColor = 'black'
  returnKeyType = 'next'
  keyBoardType = 'email-address'
  autoCapitalize = 'none'
  autoCorrect = {false}
  nChangeText = { contact => this.setState({ contact })}
  value = {this.state.contact}/>*/
  /*<Picker
    selectedValue = {this.state.category}
    style = {styles.input}
    mode = 'dropdown'
    onValueChange = {(itemValue, itemIndex) =>
      this.setState({ category : itemValue})}>
    <Picker.Item label = "Tech" value = "tech" />
    <Picker.Item label = "Cultural" value = "Cultural" />
  </Picker>*/


const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    alignItems: 'flex-start',
    justifyContent : 'flex-start',
    height : 700,
    width : '100%'
    //width: 100,
    //height: 100,
  },
  input : {
    height : 40,
    width : '80%',
    alignSelf : 'center',
    backgroundColor : 'rgba(255,255,255,0)',
    marginBottom : '5%',
    paddingHorizontal : 15,
    color : '#000000',
    borderBottomColor : 'black',
    borderBottomWidth : 1,
  },
  ImageContainer: {
      flex : 45,
      borderColor: '#9B9B9B',
      borderWidth: 1 / PixelRatio.get(),
      //borderRadius : 150/2,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems : 'center',
      backgroundColor: Colors.white,
      marginBottom : 25,
      marginTop : 25,
      width : '80%',
      aspectRatio : 1/1,
    },
    buttonContainer : {
      //position: 'absolute',
      backgroundColor : Colors.primaryBackGourndColor,
      paddingVertical : 20,
      bottom : 5,
      marginTop : '1%',
      marginLeft : '2%',
      alignSelf : 'center',
      width : '80%',

    },
    buttonText : {
      textAlign : 'center',
      backgroundColor : Colors.primaryAppColor,
      paddingVertical : 15,
      fontWeight : '700'
    },
  })
