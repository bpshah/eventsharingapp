import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker,TouchableHighlight} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import Activity from '../components/activityIndicator.js'

//import ImagePicker from 'react-native-image-picker';
//import ImageSlider from 'react-native-image-slider';
import { Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker';
import Colors from '../styles/colors.js';
import ImageSlider from 'react-native-image-slider';
import ImagePicker from 'react-native-image-crop-picker';

const options = {
  title : 'Add Picture',
  chooseFromLibraryButtonTitle : 'Select from Library',
}

let i = 0;
let j = 0;

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
    /*headerRight : (
      <View marginRight = {10}>
        <Icon id = {1} name="check" size={20} color="#900" onPress = {this.handle}/>
      </View>

    ),*/
    headerLeft : (
      <View marginLeft = {10}>
        <TouchableOpacity onPress={() => navigation.navigate('Events')}>
          <Icon1 name="ios-arrow-back" size={25} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  })

  constructor(props){
    super(props);
    this.state = {
      avatarSource : null,
      filePath : [] ,
      eventname : '',
      place : '',
      organizer : '',
      contact : '',
      description : '',
      category : '',
      fromtime : '',
      totime : '',
      imgsrc : null,
      selectedValue : 0,
      datasrc : null,
      loading : false,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentDidMount(){

    i = 0;
    j = 0;
    let data = [];
    firebase
      .database()
      .ref('Users/')
      .once('value').then((snapshot) => {
        console.log("Before Parsing");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //item.key = csnapshot.key;
            console.log(item.token);
            data.push(item.token);
        });
        //console.log("After Parsing Event Create : ");
        //console.log("Data:" + data);
        this.setState({
          datasrc : data,
        });
        console.log("Data src:" + this.state.datasrc[0]);
        console.log("Data src:" + this.state.datasrc[1]);
        console.log("Data src:" + this.state.datasrc[2]);

      })
      //console.log("After Fetch");

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
        console.log("UPUri " + uri);
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
          this.state.imgsrc[j] = url;
          j = j + 1;
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
        let imgs = [];
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
        ImagePicker.openPicker({
          multiple: true
        }).then(images => {
          console.log(images);
          images.forEach((img) => {
            imgs.push(img.path);
          })
          console.log("in picker");
          console.log(imgs);
          this.setState({
            filePath : imgs,
          })
          console.log(this.state.filePath);
        });
        /*ImagePicker.showImagePicker(response => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            let source = response;
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.state.filePath[i] = source.uri;
            i = i + 1;
            //console.log("I", i);
            console.log("Filepath : " + this.state.filePath[0]);
            console.log("Filepath : " + this.state.filePath[1]);
            console.log("Filepath : " + this.state.filePath[2]);

          }
        });*/
    };

  handleEvent = () => {

      let user = firebase.auth().currentUser;
      const email = user.email;
      //const temail = email.slice(0,user.email.indexOf('@'));
      let fromtime = this.state.fromtime;
      let totime = this.state.totime;
      let place = this.state.place;
      let mobileno = this.state.contact;
      let description = this.state.description;
      let org = this.state.organizer;
      let eventname = this.state.eventname;
      let category = this.state.category;
      let imgsrc = this.state.imgsrc;

      let uid  = email.slice(0,user.email.indexOf('@'));
      console.log("Before Upload");
      firebase
        .database()
        .ref('Events/'+ this.state.eventname)
        .set({ eventname, place, org, mobileno, description,category,fromtime,totime,uid,imgsrc})
        .then(() => {
          const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({routeName: "Events"})
                      ]
                    });
                    this.props.navigation.dispatch(resetAction);
        })
        .catch(error => this.setState({ errorMessage: error.message }))
      console.log("Event Upload");
    }

  uploadImages = async (photos) => {
    console.log("In photos : " + photos);
    const uploadImagePromises = photos.map((p, index) => {
      console.log("P :" + p);
      this.uploadImage( p, this.state.eventname + index )})
    const urls = await Promise.all(uploadImagePromises)
    console.log("Urls",urls);
  }
//  <service android:name="io.invertase.firebase.messaging.RNFirebaseBackgroundMessagingService" />

  handle = () => {
    this.setState({
      loading : true,
    })
    //console.log("Before Handle");
    //console.log(this.state.filePath);
    this.uploadImages(this.state.filePath)
    .then( () => this.handleEvent())
    .then( () => {
      this.setState({
        loading : false,
      })
    });
    //console.log("After handle");
    fetch('https://fcm.googleapis.com/fcm/send',
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAAP6OjSUc:APA91bGDee_s4YQeGx2pK1-WqjsqG3coAXtAhFRG_lB9A9SGzQB9dGGMasO90_TtbdqNfVW_nkhe3eTAAu8jXy3HyNBofELij1xAx7aHnP7tUk6iDrsDHjkzZidCUiPHoUTCt8ku5sP0'
                },
                body: JSON.stringify(
                {
                  "notification": {
                    "title": this.state.eventname,
                    "body": this.state.place,
                },
                "data": {
                  "title": this.state.eventname,
                  "body": "Place" + this.state.place + this.state.organizer,
                },
                  "registration_ids" : this.state.datasrc,
                })

            }).then((response) => response.json()).then((responseJsonFromServer) =>
            {
                console.log(responseJsonFromServer);


            }).catch((error) =>
            {
              console.log(error);
            });
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  render(){

    return(
      <ScrollView contentContainerStyle = {styles.container}
                  behaviour = 'height'>

          <View style = {{height : 200,marginTop : '5%',marginLeft : '2%',marginRight : '2%',marginBottom : '1%',width : '100%'}}>
            <ImageSlider
              loopBothSides
              images = {this.state.filePath}
              style = {{backgroundColor : Colors.primaryBackGourndColor}}
              customSlide = {({ index, item, style, width }) => (
              <View key={index} style={[style, styles.Slide]}>
                <Avatar
                  rectangle
                  source = {{uri : item}}
                  size = 'xlarge'
                  height = '90%'
                  width = '90%'
                  alignSelf = 'center'
                  backgroundColor = '#000000'
                  imageProps = {{resizeMode : 'stretch'}}
                  showEditButton
                  onEditPress = {this.chooseFile.bind(this)}

                />
              </View>
            )}
              customButtons={(position, move) => (
                <View style={styles.buttons}>
                  {this.state.filePath.map((image, index) => {
                    return (
                      <TouchableHighlight
                        key = {index}
                        underlayColor="#ccc"
                        onPress = {() => move(index)}
                        style = {styles.button}
                      >
                      <Text style = {position === index && styles.buttonSelected}>
                       {index + 1}
                      </Text>
                    </TouchableHighlight>
                  );
                })}
              </View>
            )}
            />
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Event Name'
              placeholder = "Name of Event"
              //placeholderTextColor = 'black'
              returnKeyType = 'next'
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('two');
              }}
              //keyBoardType = 'email-address'
              autoCapitalize = 'words'
              autoCorrect = {false}
              onChangeText = { eventname => this.setState({ eventname })}
              value = {this.state.eventname}
              ref = { input => {
                this.inputs['one'] = input;
              }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
            <Icon name="map-marker-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Place'
              placeholder = 'Place of Event(e.g. Address, City)'
              //placeholderTextColor = 'black'
              returnKeyType = 'next'
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('three');
              }}
              autoCapitalize = 'words'
              autoCorrect = {false}
              onChangeText = { place => this.setState({ place })}
              value = {this.state.place}
              ref = { input => {
                this.inputs['two'] = input;
              }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
              <Icon name="landmark"
                size={22}
                color='black'
                style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                title = 'Organizer Name'
                placeholder = 'Organizer of Event'
                //placeholderTextColor = 'black'
                returnKeyType = 'next'
                blurOnSubmit = { false }
                onSubmitEditing = { () => {
                  this.focusNextField('four');
                }}
                //keyBoardType = 'email-address'
                autoCapitalize = 'words'
                autoCorrect = {false}
                onChangeText = { organizer => this.setState({ organizer })}
                value = {this.state.organizer}
                ref = { input => {
                  this.inputs['three'] = input;
                }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
              <Icon name="phone"
                size={22}
                color='black'
                style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                title = 'Contact'
                placeholder = 'Contact of Organizer'
                //placeholderTextColor = 'black'
                returnKeyType = 'next'
                blurOnSubmit = { false }
                onSubmitEditing = { () => {
                  this.focusNextField('five');
                }}
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                enablesReturnKeyAutomatically = {true}
                onChangeText = { contact => this.setState({ contact })}
                value = {this.state.contact}
                ref = { input => {
                  this.inputs['four'] = input;
                }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
            <DatePicker
              style = {{width : '100%',marginBottom : '1%',marginTop : '1%',marginLeft : '14%',marginRight : '4.5%'}}
              format = 'LLL'
              date = {this.state.fromtime}
              placeholder = "(From)Select Event Date"
              mode = "datetime"
              onCloseModal = { () => {
                this.focusNextField('six');
              }}
              iconComponent = {
                <Icon name="calendar-alt"
                  size={24}
                  color='black'
                  style = {{ position : 'absolute', left : '5%', top : '30%', alignSelf : 'center',marginTop : '0%'}}
                />
              }
              onDateChange = {(time) => {this.setState({fromtime : time})}}
              customStyles = {{
                dateInput : {
                  flexDirection : 'column',
                  justifyContent : 'flex-start',
                  paddingHorizontal : 15,
                  borderBottomColor : 'black',
                  marginRight : '4.5%',
                  borderBottomWidth : 1,
                  borderColor : Colors.primaryBackGourndColor,
                  marginLeft : '15%',
                  alignItems: 'flex-start'
                },
                placeholderText : {
                    color : 'rgba(0,0,0,0.4)',
                    fontSize : 16,
                    justifyContent : 'center',
                },
              }}
              ref = { input => {
                this.inputs['five'] = input;
              }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
            <DatePicker
              style = {{width : '100%',marginBottom : '4%',marginTop : '5%',marginLeft : '14%',marginRight : '4.5%'}}
              format = 'LLL'
              date = {this.state.totime}
              placeholder = "(To)Select Event Date"
              mode = "datetime"
              blurOnSubmit = { false }
              onCloseModal = { () => {
                this.focusNextField('seven');
              }}
              iconComponent = {
                <Icon name="calendar-alt"
                  size={24}
                  color='black'
                  style = {{ position : 'absolute', left : '5%', top : '30%', alignSelf : 'center',marginTop : '0%'}}
                />
              }
              onDateChange = {(time) => {this.setState({totime : time})}}
              customStyles = {{
                dateInput : {
                  flexDirection : 'column',
                  justifyContent : 'flex-start',
                  paddingHorizontal : 15,
                  borderBottomColor : 'black',
                  marginRight : '4.5%',
                  borderBottomWidth : 1,
                  borderColor : Colors.primaryBackGourndColor,
                  marginLeft : '15%',
                  alignItems: 'flex-start'
                },
                placeholderText : {
                    color : 'rgba(0,0,0,0.4)',
                    fontSize : 16,
                    justifyContent : 'center',
                },
              }}
              />
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
            <Icon name="scroll"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Description'
              placeholder = 'Description of Event'
              //placeholderTextColor = 'black'
              returnKeyType = 'next'
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('eight');
              }}
              //keyBoardType = 'email-address'
              multiline = {false}
              enablesReturnKeyAutomatically = {true}
              autoCapitalize = 'sentences'
              autoGrow = {true}
              autoCorrect = {false}
              numberOfLines = {2}
              onChangeText = { description => this.setState({ description })}
              value = {this.state.description}
              ref = { input => {
                this.inputs['seven'] = input;
              }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%',marginBottom : '2%'}}>
            <Icon name="stream"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <View style = {{flexDirection : 'row', flex : 1, borderBottomWidth : 1, width : '80%', backgroundColor : 'rgba(255,255,255,0)', borderBottomColor : 'black',marginLeft : '0%'}}>
              <Picker
                selectedValue = {this.state.category}
                mode = 'dropdown'
                prompt = "Event Category"
                blurOnSubmit = { false }
                style = {[styles.input,{marginLeft : '3%'}]}
                onValueChange = {(itemValue, itemIndex) =>
                  this.setState({ category : itemValue,selectedValue : itemIndex})}
                  ref = { input => {
                    this.inputs['eight'] = input;
                  }}>
                <Picker.Item label = "Event Category" value = "event" />
                <Picker.Item label = "Tech" value = "tech" />
                <Picker.Item label = "Cultural" value = "cultural" />
                <Picker.Item label = "Sports" value = "sports" />
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

const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'center',
    width : '100%',
    height : 860,
    paddingBottom : 40,
  },
  input : {
    height : 40,
    width : '80%',
    alignSelf : 'center',
    backgroundColor : 'rgba(255,255,255,0)',
    marginBottom : '5%',
    paddingHorizontal : 15,
    color : 'rgba(0,0,0,0.4)',
    borderBottomColor : 'black',
    fontSize : 16,
    borderBottomWidth : 1,
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
    color : 'white',
    paddingVertical : 15,
    fontWeight : '700'
  },
  customImage : {
    resizeMode : 'stretch',
  },
  Slide : {
    backgroundColor: Colors.primaryBackGourndColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius : 10,
    marginTop : '0%',
    color : 'white'
    //height : '25%',
    //marginLeft : '0.5%'
  },
  buttons : {
    zIndex: 1,
    height: 15,
    marginTop: -40,
    marginBottom: 10,
    marginLeft : '2%',
    marginRight : '2%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor : Colors.inputBackgroundColor,
  },
  button : {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected : {
    opacity: 1,
    color: 'black',
  },
})
