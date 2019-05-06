import React, {Component}  from 'react';
import {  PixelRatio,
          View,
          ScrollView ,
          Text,
          Image,
          StyleSheet,
          TextInput,
          Dimensions,KeyboardAvoidingView,
          TouchableOpacity,
          Picker,
          TouchableHighlight,
          ToastAndroid} from 'react-native';
import {  StackActions,
          NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import Activity from '../components/activityIndicator.js'
import {  Avatar,
          CheckBox } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker';
import Colors from '../styles/colors.js';
import ImageSlider from 'react-native-image-slider';
import ImagePicker from 'react-native-image-crop-picker';

export default class EditEvent extends Component {

constructor(props){
    super(props);
    this.state = {
      imgsrc : this.props.navigation.state.params.imgsrc,
      fromtime : this.props.navigation.state.params.fromtime,
      totime : this.props.navigation.state.params.totime,
      selectedPlace : this.props.navigation.state.params.place,
      org : this.props.navigation.state.params.organizer,
      description : this.props.navigation.state.params.desc,
      title : this.props.navigation.state.params.title,
      contact : this.props.navigation.state.params.contact,
      selectedCategory : this.props.navigation.state.params.category,
      limit : this.props.navigation.state.params.limit,
      place : [],
      eventname : this.props.navigation.state.params.title,
      category : [],
      filePath : [],
      tempFilePath : null,
      cats : null,
      token : null,
      checked : [],
      height : 0,
      selectedValuePlace : 0,
      selectedValueCategory : 0,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};

  }

static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'justify',
       flex : 1,
       fontSize : 20,
     },
    title : navigation.state.params.title,
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

componentWillMount(){
    firebase
      .database()
      .ref('Locations/')
      .once('value').then((snapshot) => {
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            this.state.place.push(item);

        });
      })
    this.fetchMembers();
    this.setImageSource();
  }

// function fot manipulating checkbox state i.e checked or not
setCheckBoxState = () => {
  this.state.selectedCategory.forEach((item) => {
    this.state.checked[this.state.category.indexOf(item)] = true;
  })
}

// function for setting filepaths of images to be uploaded
setImageSource = () => {
  let img = [];
  img.push(this.state.imgsrc);
  console.log("Temp0 : " + img);
  this.setState({
    tempFilePath : img,
  })
  console.log("Temp1 : " + this.state.tempFilePath);
  if(this.state.filePath.length != 0){
    img.push(this.state.filePath);
    this.setState({
      tempFilePath : img,
    })
    console.log("Temp File Path : " + this.state.tempFilePath);
    return this.state.tempFilePath
  }
  else{
    return this.state.tempFilePath
  }
}

// function for opening storage and choosing file to be uploaded
chooseFile = () => {
      let imgs = [];
      //imgs.push(this.state.imgsrc)
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
        this.setState({
          filePath : imgs,
        })
        console.log(this.state.filePath);
      })
      .then(() => {
        this.setImageSource();
      });
  };

// fetching device tokens for user who are coming to this event
fetchMembers = () => {
  console.log(this.state.title);
  let data1 = [];
  firebase
    .database()
    .ref('Events/' + this.state.title + '/' + 'members')
    .once('value')
    .then(async (snapshot) => {
      //console.log(snapshot);
      let keys = snapshot._childKeys;
      await keys.forEach((item) => {
        //console.log(snapshot._value[item].ename);
        firebase
          .database()
          .ref('Users/' + snapshot._value[item] + '/' + 'token')
          .once('value')
          .then((snapshot) => {
            //console.log(snapshot._value);
            data1.push(snapshot._value);
            //console.log(data1);
          })
          .then(() => {
            this.setState({
              token : data1,
            })
            //console.log(this.state.token);
          })
        })
      })

}

// function to upload multiple images
uploadImages = async (photos) => {
  console.log("In photos : " + photos);
  const uploadImagePromises = photos.map((p, index) => {
    console.log("P :" + p);
    index += this.state.imgsrc.length;
    this.uploadImage( p, this.state.eventname + index )})
  const urls = await Promise.all(uploadImagePromises)
}

// function to map checkbox values to array for uploading on database
mapCheckBox = () => {
  let cats = [];
  this.state.category.forEach((cat) => {
    if(this.state.checked[this.state.category.indexOf(cat)] === true){
      cats.push(this.state.category[this.state.category.indexOf(cat)]);
    }
  })
  return cats;
}

// function to update event details on the database
handleEventUpdate = () => {

    let place = this.state.selectedPlace;
    let mobileno = this.state.contact;
    let imgsrc = this.state.imgsrc;
    let fromtime = this.state.fromtime;
    let totime = this.state.totime;
    let description = this.state.desc;
    let membersLimit = this.state.limit;

    console.log("Before Update");
    // updating new event details
    firebase.database().ref('Events/' + this.state.eventname).update({membersLimit,place,mobileno,imgsrc,fromtime,totime,description});
    console.log("Updated");
  }

// update event routine with different subroutines
updateEvent = () => {
  let user = firebase.auth().currentUser;
  const temail = user.email.slice(0,user.email.indexOf('@'));
  console.log("FilePath : " + this.state.filePath);
    this.uploadImages(this.state.filePath,temail + '.png')          // uploading new event images
        .then( () => { this.setState({
                              loading : false,
                              });
                              this.handleEventUpdate() })           // updating event details after uploading the images
        .then(() => {                                               // sending notification to used who have joine the event about the event update
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
                        "registration_ids" : this.state.token,
                      })
                  }).then((response) => response.json()).then((responseJsonFromServer) =>
                  {
                    console.log(responseJsonFromServer);
                  }).catch((error) =>
                  {
                    console.log(error);
                  });

        })
        .then(() => this.props.navigation.navigate('MyEvents'));                      ;

  console.log("After Update");
}

focusNextField(id) {
  this.inputs[id].focus();
}


  render(){
    {this.setImageSource}
    return(
      <ScrollView contentContainerStyle = {[styles.container,{height : 775 + this.state.height}]}
                  >
          <View style = {{height : 200, width : '100%',marginTop : '5%',marginLeft : '2%',marginRight : '2%',marginBottom : '1%'}}>
            <ImageSlider
              loopBothSides
              images = {this.state.imgsrc}
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
              editable = {false}
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('two');
              }}
              //keyBoardType = 'email-address'
              autoCapitalize = 'words'
              autoCorrect = {false}
              onChangeText = { title => this.setState({ title })}
              value = {this.state.title}
              ref = { input => {
                this.inputs['one'] = input;
              }}/>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '0%',marginRight : '4.5%',marginLeft : '2%',marginBottom : '1%'}}>
            <Icon name="map-marker-alt"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <View
                style = {{flexDirection : 'row', flex : 1, borderBottomWidth : 1, width : '80%',marginBottom : '5%', backgroundColor : 'rgba(255,255,255,0)', borderBottomColor : 'black',marginLeft : '0%'}}>
                <Picker
                  selectedValue = {this.state.selectedPlace}
                  mode = 'dropdown'
                  style = {[styles.pickerStyle,{color : Colors.placeholderText,marginLeft : '3%'}]}
                  onValueChange = {(itemValue, itemIndex) =>
                    this.setState({ selectedPlace : itemValue,selectedValuePlace : itemIndex})}
                >
                <Picker.Item label="Select Location" value="location"/>
                {
                  this.state.place.map((item,index) =>
                  <Picker.Item label={item} value={item}/>
                )
                }
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
                onChangeText = { org => this.setState({ org })}
                value = {this.state.org}
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
              <Icon name="users"
                size={22}
                color='black'
                style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                title = 'Limit'
                placeholder = 'No. Of People'
                placeholderTextColor = {Colors.placeholderText}
                returnKeyType = 'next'
                blurOnSubmit = { false }
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
                enablesReturnKeyAutomatically = {true}
                onChangeText = { limit => this.setState({ limit })}
                value = {this.state.limit}
                ref = { input => {
                  this.inputs['six'] = input;
                }}/>
          </View>

          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '4.5%',marginLeft : '2%'}}>
            <Icon name="scroll"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {[styles.input,{flex : 1},{height : Math.max(35, this.state.height)}]}
              title = 'Description'
              placeholder = 'Description of Event'
              placeholderTextColor = {Colors.placeholderText}
              returnKeyType = 'next'
              blurOnSubmit = { false }
              onSubmitEditing = { () => {
                this.focusNextField('eight');
              }}
              //keyBoardType = 'email-address'
              multiline = {true}
              enablesReturnKeyAutomatically = {true}
              autoCapitalize = 'sentences'
              autoGrow = {true}
              autoCorrect = {false}
              numberOfLines = {1}
              onChangeText = { desc => this.setState({ desc })}
              onContentSizeChange={(event) => {
                this.setState({ height : event.nativeEvent.contentSize.height })
              }}
              value = {this.state.desc}
              ref = { input => {
                this.inputs['seven'] = input;
              }}/>
          </View>
          <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {this.updateEvent}>
              <Text style = {styles.buttonText}>Update Event</Text>
          </TouchableOpacity>

      </ScrollView>
    )
  }
}

/*<Text style = {{alignSelf : 'flex-start',paddingTop : '1%',paddingBottom : '1%',marginBottom : '2%',marginTop : '2%',marginRight : '8%',marginLeft : '10%',fontSize : 16}}> Category : </Text>
          <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'flex-start',marginTop : '1%',marginRight : '0%',marginLeft : '8%',marginBottom : '2%',flexWrap : 'wrap'}}>
            {
              this.state.category.map((item,index) => {
              //console.log(item + " " + index)
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
                  containerStyle = {{backgroundColor : Colors.primaryBackGourndColor,borderWidth : 0,padding : 1}}
                />
            )
            })}
          </View>
*/

const styles = StyleSheet.create({
  container : {
    flexGrow : 1,
    //flex : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'center',
    width : '100%',
    paddingBottom : 20,
    //flexWrap : 'wrap',
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
