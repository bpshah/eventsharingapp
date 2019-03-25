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
      categories : ['Tech','Sports','Cultural'],
      checked : [ false ,false, false],
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

  focusNextField(id) {
    this.inputs[id].focus();
  }

  changeCheckBox = (index) => {
    console.log(" abc "+ index);
    let check = this.state.checked;
    check[index] = !check[index];
    console.log(check);
    this.setState({
      checked : check,
    })
    //console.log(this.state.checked);
  }

  mapCheckBox = () => {
    let cats = [];
    this.state.categories.forEach((cat) => {
      if(this.state.checked[this.state.categories.indexOf(cat)] === true){
        cats.push(this.state.categories[index]);
      }
    })
    return cats;
  }

  CreateGroup = () => {

    let groupName = this.state.groupName;
    let desc = this.state.description;
    let location = this.state.location;
    let tcats = this.mapCheckBox();
    //console.log("Cats : " + tcats);
    firebase
      .database()
      .ref('Groups/' + this.state.groupName)
      .set({groupName,desc,location,tcats})
  }

  render(){
    return(
      <ScrollView contentContainerStyle = {styles.container}>
        <Avatar
            rounded
            showEditButton
            size = "xlarge"
            margin = {20}
            alignSelf = 'center'
        />
        <Text style = {{alignSelf : 'center',fontSize : 18,color : 'black',marginBottom : '8%'}}>Find LikeMinded people and do your thing</Text>
        <Divider style = {{ flex : 1,backgroundColor: Colors.primaryAppColor,height : 1}} />
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
        <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '-1%',marginRight : '8%',marginLeft : '2%'}}>
          <Icon name="clipboard"
            size={22}
            color='black'
            style = {{marginLeft : '10%',marginRight : '4.5%',marginBottom : '1%',alignSelf : 'center'}}/>
          <TextInput style = {styles.input}
            title = 'Description'
            placeholder = "Description"
            placeholderTextColor = {Colors.placeholderText}
            autoCapitalize = 'sentences'
            returnKeyType = 'next'
            autoCorrect = {false}
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
        <Divider style = {{ flex : 1,backgroundColor: Colors.primaryAppColor,height : 1}} />
        <Text style = {{alignSelf : 'flex-start',paddingTop : '1%',paddingBottom : '1%',marginBottom : '2%',marginTop : '2%',marginRight : '8%',marginLeft : '10%',fontSize : 16}}> Category : </Text>
        <View style = {{flexDirection : 'row',justifyContent: 'space-between',alignSelf : 'flex-start',marginTop : '1%',marginLeft : '8%',flexWrap: 'wrap'}}>
        {
          this.state.categories.map((item,index) => {
            console.log(index)
            return (
              <CheckBox
                title = {item}
                checked = {this.state.checked[index]}
                onPress = {(index) => {
                  console.log("index : " + Object.key())
                  this.changeCheckBox(index)}}
                containerStyle = {{backgroundColor : Colors.primaryBackGourndColor,borderWidth : 0,padding : 0}}
              />
          )
          })
        }
        </View>
        <TouchableOpacity style = {styles.buttonContainer}
                          onPress = {this.CreateGroup()}>
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
