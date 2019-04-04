import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker,TouchableHighlight,ToastAndroid} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import Activity from '../components/activityIndicator.js'
import { Avatar,Divider,CheckBox } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker';
import Colors from '../styles/colors.js';
import ImageSlider from 'react-native-image-slider';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../components/loader.js'

export default class CreateGroup extends Component{

  constructor(props){
    super(props);
    this.state = {
      groupName : '',
      description : '',
      location : '',
      filePath : '',
      imgsrc : [],
      loading : false,
      categories : [],
      checked : [],
      height : 0,
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};

  }

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'justify',
       flex : 1,
       fontSize : 20,
     },
    title : 'New Group',
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
      .ref('Catgory/')
      .once('value').then((snapshot) => {
        //console.log("Before Parsing Categories");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //console.log("Category : " + item);
            this.state.categories.push(item);
        });
        //console.log("Data 2 : " + this.state.categories);
      })
      .then(() => {
        let check = [];
        this.state.categories.forEach((item) => {
          check.push(false);
        })
        this.setState({
          checked : check,
        })
        //console.log("Check : " + check);
        //console.log("Checked : " + this.state.checked);
      })


  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  /*generateCheckboxgroup = () => {
    this.state.categories.map((item,index) => {
      console.log(item + " " + index)
      return (
        <CheckBox
          title = {item}
          checked = {this.state.checked}
          onPress = {this.changeCheckBox(index)}
          containerStyle = {{backgroundColor : Colors.primaryBackGourndColor,borderWidth : 0,padding : 0}}
        />
    )
    })
  }*/

  mapCheckBox = () => {
    let cats = [];
    this.state.categories.forEach((cat) => {
      if(this.state.checked[this.state.categories.indexOf(cat)] === true){
        cats.push(this.state.categories[this.state.categories.indexOf(cat)]);
      }
    })
    return cats;
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
        const imageRef = firebase.storage().ref('groupDP').child(this.state.groupName).child(imageName)
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
            .ref('Groups/' + this.state.groupName)
            .update({imgsrc});
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  chooseFile = () => {
        //let imgs = [];
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
          multiple : false
        }).then(image => {
          this.setState({
            filePath : image.path,
          })
          //console.log("Filepath : " + this.state.filePath);
        });
    };

  CreateGroup = () => {

    let groupName = this.state.groupName;
    let desc = this.state.description;
    let location = this.state.location;
    let tcats = this.mapCheckBox();
    let admin = firebase.auth().currentUser.email.slice(0,user.email.indexOf('@'))
    this.setState({
      loading : true,
    })
    if( groupName != '' &&
        location != ''){
      console.log("Cats : " + tcats);
      this.uploadImage(this.state.filePath,this.state.groupName)
      .then(() => {
        firebase
          .database()
          .ref('Groups/' + this.state.groupName)
          .set({groupName,desc,location,tcats,admin})
      })
      .then(() => {
        this.setState({
          loading : false,
        })
      })
      .then(() => this.props.navigation.navigate('Events'))
    }
    else {
      ToastAndroid.showWithGravity( 'Group Name and Location cannot be empty.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
    }
  }

  render(){
    return(
      <ScrollView contentContainerStyle = {[styles.container],{height : 700 + this.state.height}}>
        <Avatar
            rounded
            source = {{ uri : this.state.filePath }}
            showEditButton
            size = "xlarge"
            margin = {20}
            alignSelf = 'center'
            onEditPress = {this.chooseFile.bind(this)}
        />
        <Loader loading = {this.state.loading}/>
        <Text style = {{alignSelf : 'center',fontSize : 18,color : 'black',marginBottom : '8%'}}>Find LikeMinded people and do your thing</Text>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '5%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="user-friends"
            size={22}
            color='black'
            style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            title = 'Group Name'
            placeholder = "Enter Group Name"
            placeholderTextColor = {Colors.placeholderText}
            returnKeyType = 'next'
            autoCorrect = {false}
            onChangeText = {groupName => this.setState({ groupName })}
            onSubmitEditing = { () => {
              this.focusNextField('two');
            }}
            ref = { input => {
              this.inputs['one'] = input;
            }}
            autoCapitalize = 'words'
            value = {this.state.groupName}
            autoFocus = {false}/>
        </View>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="clipboard"
            size={22}
            color='black'
            style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
          <TextInput style = {[styles.input,{flex : 1},{height : Math.max(35, this.state.height)}]}
            title = 'Description'
            placeholder = "Description"
            placeholderTextColor = {Colors.placeholderText}
            autoCapitalize = 'sentences'
            returnKeyType = 'next'
            autoCorrect = {false}
            autoGrow = {true}
            multiline = {true}
            onContentSizeChange={(event) => {
              this.setState({ height : event.nativeEvent.contentSize.height })
              console.log(this.state.height)
            }}
            onChangeText = {description => this.setState({ description })}
            ref = { input => {
              this.inputs['two'] = input;
            }}
            value = {this.state.description}
            autoFocus = {false}/>
        </View>
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="map-marker-alt"
            size={22}
            color='black'
            style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            title = 'Location'
            placeholder = "Location"
            placeholderTextColor = {Colors.placeholderText}
            returnKeyType = 'next'
            autoCapitalize = 'words'
            autoCorrect = {false}
            onChangeText = {location => this.setState({ location })}
            ref = { input => {
              this.inputs['three'] = input;
            }}
            value = {this.state.location}
            autoFocus = {false}/>
        </View>
        <Text style = {{alignSelf : 'flex-start',paddingTop : '1%',paddingBottom : '1%',marginBottom : '2%',marginTop : '2%',marginRight : '8%',marginLeft : '10%',fontSize : 16}}> Category : </Text>
        <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'flex-start',marginTop : '1%',marginLeft : '8%',
        flexWrap: 'wrap'}}>
        {
          this.state.categories.map((item,index) => {
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
              containerStyle = {{backgroundColor : Colors.primaryBackGourndColor,borderWidth : 0,padding : 0}}
            />
        )
        })}
        </View>
        <TouchableOpacity style = {styles.buttonContainer}
                          onPress = {this.CreateGroup}>
              <Text style = {styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent : 'flex-start',
    width : '100%'
  },
  input : {
    height : 40,
    width : '80%',
    alignSelf : 'center',
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : 20,
    paddingHorizontal : 10,
    color : Colors.inputColor,
    borderBottomColor : Colors.borderColor,
    borderBottomWidth : 1,
  },
  buttonContainer : {
    backgroundColor : Colors.primaryBackGourndColor,
    paddingVertical : 20,
    bottom : 5,
    marginLeft : '2%',
    alignSelf : 'center',
    width : '80%',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    fontWeight : '700',
    color : 'white',
  },
})
