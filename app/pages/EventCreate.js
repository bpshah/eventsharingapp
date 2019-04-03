import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker,TouchableHighlight,ToastAndroid} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import Activity from '../components/activityIndicator.js'
import { Avatar,CheckBox } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker';
import Colors from '../styles/colors.js';
import ImageSlider from 'react-native-image-slider';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../components/loader.js'

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
    drawerLockMode: 'locked-open',
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
      filePath : [] ,
      eventname : '',
      place : [],
      organizer : '',
      contact : '',
      description : '',
      category : [],
      fromtime : '',
      totime : '',
      imgsrc : [],
      selectedPlace : '',
      selectedValuePlace : 0,
      selectedCategory : '',
      selectedValueCategory : 0,
      datasrc : null,
      loading : false,
      address : '',
      checked : [],
      color : Colors.placeholderText,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentWillMount(){
    firebase
      .database()
      .ref('Locations/')
      .once('value').then((snapshot) => {
        //console.log("Before Parsing Locations");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //console.log("Locations : " + item);
            this.state.place.push(item);

        });
        console.log("Data 1 : " + this.state.place);
      })
    firebase
      .database()
      .ref('Catgory/')
      .once('value').then((snapshot) => {
        //console.log("Before Parsing Categories");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //console.log("Category : " + item);
            //this.state.category.push(item);
        });
        //console.log("Data 2 : " + this.state.category);
      })
      .then(() => {
        let check = [];
        this.state.category.forEach((item) => {
          check.push(false);
        })
        this.setState({
          checked : check,
        })
        //console.log("Check : " + check);
        //console.log("Checked : " + this.state.checked);
      })
  }

  /*componentDidMount(){

    i = 0;
    j = 0;
    let data = [];

    firebase
      .database()
      .ref('Users/')
      .orderBy('location')
      .equalTo(this.state.selectedPlace)
      .once('value').then((snapshot) => {
        console.log("Before Parsing");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            console.log(item.token);
            data.push(item.token);
        });
        //console.log("Tokens : " + data);
        this.setState({
          datasrc : data,
        });
      })
}*/

  componentDidMount(){
    //this.changePickerColor();
  }

  notificationLocation = async () => {

    let data = [];
    //console.log("Place : " + this.state.selectedPlace);
    await firebase
      .database()
      .ref('Users/')
      .orderByChild('location')
      .equalTo(this.state.selectedPlace)
      .once('value').then((snapshot) => {
        //console.log("Before Parsing");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //console.log(csnapshot.val());
            data.push(item.token);
        });
        //console.log("Tokens : " + data);
        this.setState({
          datasrc : data,
        });
        console.log("Datasrc : " + this.state.datasrc);
      })
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
          console.log("Image Uploaded : " + url);
          this.state.imgsrc.push(url);
          console.log("Imgsrc : " + this.state.imgsrc);
          let imgsrc = this.state.imgsrc;
          firebase
            .database()
            .ref('Events/'+ this.state.eventname)
            .update({imgsrc});
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
          //console.log(images);
          images.forEach((img) => {
            imgs.push(img.path);
          })
          this.setState({
            filePath : imgs,
          })
          //console.log(this.state.filePath);
        });
    };

  mapCheckBox = () => {
    let cats = [];
    this.state.category.forEach((cat) => {
      if(this.state.checked[this.state.category.indexOf(cat)] === true){
        cats.push(this.state.category[this.state.category.indexOf(cat)]);
      }
    })
    return cats;
  }

  handleEvent = () => {

      let user = firebase.auth().currentUser;
      const email = user.email;
      let fromtime = this.state.fromtime;
      let totime = this.state.totime;
      let place = this.state.selectedPlace;
      let mobileno = this.state.contact;
      let description = this.state.description;
      let org = this.state.organizer;
      let eventname = this.state.eventname;
      let category = this.state.selectedCategory;
      let imgsrc = this.state.imgsrc;
      let address = this.state.address;
      let tcats = this.mapCheckBox();

      console.log("In Handle Event : " + imgsrc);
      let uid  = email.slice(0,user.email.indexOf('@'));
      firebase
        .database()
        .ref('Events/'+ this.state.eventname)
        .set({ eventname, place, org, mobileno, description,tcats,fromtime,totime,uid,imgsrc,address})
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
      //console.log("Event Upload");
    }

  uploadImages = async (photos) => {
    //console.log("In photos : " + photos);
    let array = [];
    const uploadImagePromises = photos.map((p, index) => {
      //console.log("P :" + p);
      array.push(this.uploadImage( p, this.state.eventname + index ));
      })
    await Promise.all(array)
    //console.log("Urls",urls);
  }
// <service android:name="io.invertase.firebase.messaging.RNFirebaseBackgroundMessagingService" />
  handle = () => {
    if(this.state.eventname != '' &&
      this.selectedPlace != 'Select Location' &&
      this.state.organizer != '' &&
      this.state.mobileNumber != '' &&
      this.state.fromtime != '' &&
      this.state.selectedCategory != 'category'){
        this.setState({
          loading : true,
        })
        this.uploadImages(this.state.filePath)
        .then( () => this.notificationLocation())
        .then( () => {
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
                          "body": this.state.selectedPlace,
                      },
                      "data": {
                        "title": this.state.eventname,
                        "body": this.state.place + this.state.organizer,
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

        })
        .then( () => this.handleEvent())
        .then( () => {
          this.setState({
            loading : false,
          })
        });
      }
      else {
        ToastAndroid.showWithGravity( 'Event Pics and some Fields cannot be empty.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
      }
    }

  changePickerColor = () => {
    console.log("in changePickerColor");
    if(this.state.selectedPlace == 'Select Location' || this.state.selectedPlace == ''){
      console.log("in if");
      this.setState({
        color : 'rgba(0,0,0,0.4)',
      })
      console.log(this.state.color);
      //return this.state.color;
    }
    else {
      console.log("in else");
      this.setState({
        color : 'black',
      })
      console.log(this.state.color);
    //return this.state.color;
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  render(){

    return(
      <ScrollView contentContainerStyle = {styles.container}
                  behaviour = 'height'
                  >

          <View style = {{ height : '22%',width : '100%',marginTop : '5%',marginLeft : '2%',marginRight : '2%',marginBottom : '1%'}}>
            <ImageSlider
              loopBothSides
              images = {this.state.filePath}
              style = {{backgroundColor : 'black',width : '100%',borderRadius : 0}}
              customSlide = {({ index, item, style, width }) => (
              <View key={index} style={[style, styles.Slide]}>
                <Avatar
                  rectangle
                  source = {{uri : item}}
                  size = 'xlarge'
                  style = {{height : "100%",width : '100%',alignSelf : 'center',marginTop : '0%'}}
                  imageProps = {{resizeMode : 'contain'}}
                  icon = {{name : 'plus', type : 'font-awesome', color : 'black', underlayColor : 'white',size : 35}}
                  onPress = {this.chooseFile.bind(this)}
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
          <Loader loading = {this.state.loading}/>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginBottom : '-2%',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="user-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Event Name'
              placeholder = "Name of Event"
              placeholderTextColor = {Colors.placeholderText}
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
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginBottom : '-2%',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
            <Icon name="map-pin"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Address of Event'
              placeholder = "Address of Event"
              placeholderTextColor = {Colors.placeholderText}
              returnKeyType = 'next'
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('three');
              }}
              //keyBoardType = 'email-address'
              autoCapitalize = 'words'
              autoCorrect = {false}
              onChangeText = { address => this.setState({ address })}
              value = {this.state.address}
              ref = { input => {
                this.inputs['two'] = input;
              }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '0%',marginRight : '4.5%',marginLeft : '2%',marginBottom : '1%'}}>
            <Icon name="map-marker-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <View
                style = {{flexDirection : 'row', borderBottomWidth : 1, width : '80%',marginBottom : '5%', backgroundColor : 'rgba(255,255,255,0)', borderBottomColor : 'black',marginLeft : '0%'}}>
                <Picker
                  selectedValue = {this.state.selectedPlace}
                  mode = 'dropdown'
                  style = {[styles.pickerStyle,{color : this.state.color,marginLeft : '3%'}]}
                  onValueChange = {(itemValue, itemIndex) =>
                    this.setState({
                      selectedPlace : itemValue,
                      selectedValuePlace : itemIndex,
                    })
                  }
                >
                <Picker.Item label="Select Location" value="location"/>
                { this.state.place.map((item,index) =>
                  <Picker.Item label={item} value={item}/>
                )}
                </Picker>
              </View>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
              <Icon name="landmark"
                size={22}
                color='black'
                style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                title = 'Organizer Name'
                placeholder = 'Organizer of Event'
                placeholderTextColor = {Colors.placeholderText}
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
                placeholderTextColor = {Colors.placeholderText}
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
              placeholderTextColor = {Colors.placeholderText}
              returnKeyType = 'next'
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('six');
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
                this.inputs['five'] = input;
              }}/>
          </View>
          <Text style = {{alignSelf : 'flex-start',paddingTop : '1%',paddingBottom : '1%',marginBottom : '2%',marginTop : '2%',marginRight : '8%',marginLeft : '12%',fontSize : 16}}> Category : </Text>
          <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'flex-start',flexWrap: 'wrap'}}>
          {
            this.state.category.map((item,index) => {
            console.log(item + " " + index)
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
                }}
                containerStyle = {{backgroundColor : Colors.primaryBackGourndColor,borderWidth : 0,padding : 0}}
              />
          )
          })}
          </View>
          <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {this.handle}>
              <Text style = {styles.buttonText}>Create Event</Text>
          </TouchableOpacity>

      </ScrollView>
    )
  }
}
/*<Icon name="stream"
  size={22}
  color='black'
  style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
<View style = {{flexDirection : 'row', flex : 1, borderBottomWidth : 1, width : '80%', backgroundColor : 'rgba(255,255,255,0)', borderBottomColor : 'black',marginLeft : '0%'}}>
  <Picker
    selectedValue = {this.state.selectedCategory}
    mode = 'dropdown'
    prompt = "Event Category"
    blurOnSubmit = { false }
    style = {[styles.pickerStyle,{color : Colors.placeholderText,marginLeft : '3%'}]}
    onValueChange = {(itemValue, itemIndex) =>
      this.setState({ selectedCategory : itemValue,selectedValueCategory : itemIndex})}
      >
      <Picker.Item label="Select Category" value="category"/>
      { this.state.category.map((item,index) =>
        <Picker.Item label={item} value={item}/>
      )}
  </Picker>
</View>*/
const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'center',
    width : '100%',
    height : 850,
    paddingBottom : 20,
  },
  input : {
    height : 40,
    width : '80%',
    alignSelf : 'center',
    backgroundColor : 'rgba(255,255,255,0)',
    marginBottom : '5%',
    paddingHorizontal : 15,
    //color : 'rgba(0,0,0,0.4)',
    borderBottomColor : 'black',
    fontSize : 16,
    borderBottomWidth : 1,
  },
  pickerStyle : {
    height : 40,
    width : '80%',
    alignSelf : 'center',
    backgroundColor : 'rgba(255,255,255,0)',
    marginBottom : '5%',
    paddingHorizontal : 15,
    //color : 'rgba(0,0,0,0.4)',
    borderBottomColor : 'black',
    //fontSize : 16,
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
    borderRadius : 0,
    marginTop : '0%',
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
