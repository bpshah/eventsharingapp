import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker,TouchableHighlight,ToastAndroid} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import Activity from '../components/activityIndicator.js'
import { Avatar } from 'react-native-elements';
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
      place : [],
      eventname : this.props.navigation.state.params.title,
      category : [],
      filePath : [],
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
        console.log("Data 1 : " + this.state.place);
      })
    firebase
      .database()
      .ref('Catgory/')
      .once('value').then((snapshot) => {
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            this.state.category.push(item);
        });
        console.log("Data 2 : " + this.state.category);
      })
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
          this.setState({
            filePath : imgs,
          })
          console.log(this.state.filePath);
        });
    };

  focusNextField(id) {
    this.inputs[id].focus();
  }

  uploadImages = async (photos) => {
    console.log("In photos : " + photos);
    const uploadImagePromises = photos.map((p, index) => {
      console.log("P :" + p);
      this.uploadImage( p, this.state.eventname + index )})
    const urls = await Promise.all(uploadImagePromises)
  }

  handleEventUpdate = () => {
    let eventname = this.state.title;
    let place = this.state.selectedPlace;
    let mobileno = this.state.contact;
    let imgsrc = this.state.imgsrc;
    let fromtime = this.state.fromtime;
    let totime = this.state.totime;
    let description = this.state.desc;

    console.log("Before Update");
    firebase.database().ref('Events/' + this.state.eventname).update({eventname,place,mobileno,imgsrc,fromtime,totime,description});
    console.log("Updated");
  }

  updateEvent = () => {
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    console.log("FilePath : " + this.state.filePath);
      this.uploadImages(this.state.filePath,temail + '.png')
          .then( () => { this.setState({
                                loading : false,
                                });
                                this.handleEventUpdate() })
          .then(() => this.props.navigation.navigate('MyEvents'));                      ;

    console.log("After Update");
  }

  render(){
    console.log(this.state.place);
    console.log(this.state.category);
    return(
      <ScrollView contentContainerStyle = {styles.container}
                  behaviour = 'height'
                  >

          <View style = {{flex: 1, width : '100%',marginTop : '5%',marginLeft : '2%',marginRight : '2%',marginBottom : '1%'}}>
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
                this.focusNextField('eight');
              }}
              //keyBoardType = 'email-address'
              multiline = {false}
              enablesReturnKeyAutomatically = {true}
              autoCapitalize = 'sentences'
              autoGrow = {true}
              autoCorrect = {false}
              numberOfLines = {2}
              onChangeText = { desc => this.setState({ desc })}
              value = {this.state.desc}
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
            </View>
          </View>
          <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {this.updateEvent}>
              <Text style = {styles.buttonText}>Update Event</Text>
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
