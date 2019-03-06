import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
//import Ev from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Events.js';
import { Button, Avatar, Divider } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';
import Fonts from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/fonts.js';



export default class Ex extends Component {

  constructor(props){
    super(props);
    this.state = ({
      imgsrc : this.props.navigation.state.params.imgsrc,
      fromtime : this.props.navigation.state.params.fromtime,
      totime : this.props.navigation.state.params.totime,
      place : this.props.navigation.state.params.place,
      org : this.props.navigation.state.params.organizer,
      description : this.props.navigation.state.params.desc,
      title : this.props.navigation.state.params.title,
      contact : this.props.navigation.state.params.contact,
    })

  }

  static navigationOptions = ({navigation}) =>({
    headerTitleStyle : {
       textAlign : 'center',
       flex : 1,
       color : Colors.white,
       fontWeight : '100',
       fontFamily : Fonts.headerStyle,
       },
    title : navigation.state.params.title,
    //headerTintColor : Colors.white,
    headerStyle : {
      backgroundColor : Colors.tabBarColor,
    },
    headerLeft : (
      <View marginLeft = {10}>
        <Icon1 name="ios-arrow-back" size={25} color={Colors.white} onPress={() => navigation.navigate('Events')}/>
      </View>
    ),
    headerRight : (
      <View marginRight = {10}>
      </View>
    )
  })

  render(){
       return(
       <ScrollView contentContainerStyle = {styles.Container}
                   behaviour = 'height'>
          <View style = {{flex : 0.5,marginTop : '5%',marginLeft : '2%',marginRight : '2%',marginBottom : '2%',width : '100%'}}>
            <Avatar
              rectangle
              source = {{uri : this.state.imgsrc}}
              height = {175}
              width = '90%'
              alignSelf = 'center'
              backgroundColor = '#F2F2F2'
              imageProps = {{resizeMode : 'stretch',borderRadius : 10}}/>
          </View>
          <Divider containerStyle = {{backgroundColor : Colors.primaryAppColor,borderWidth : 1}}/>
          <Button title = 'JOIN AND RSVP'
                    containerStyle = {styles.buttonContainer}/>
          <View style = {styles.childContainer1}>
            <Icon name="clock"
                  size={20}
                  color='black'
                  style = {{marginRight : '2.75%', marginLeft : '10%',marginBottom : '1%',alignSelf : 'center'}}/>
            <Text style = {styles.childContainerText}>From : {this.state.fromtime} {'\n'} To : {this.state.totime}</Text>
          </View>
          <View style = {styles.childContainer1}>
            <Icon name="map-marker-alt"
                size={20}
                color='black'
                style = {{marginRight : '4%', marginLeft : '10%',marginBottom : '1%',alignSelf : 'center'}}/>
            <Text style = {styles.childContainerText}>{this.state.place}</Text>
          </View>
          <View style = {styles.childContainer1}>
            <Icon name="user"
                size={20}
                color='black'
                style = {{marginRight : '4%', marginLeft : '10%',alignSelf : 'center'}}/>
            <Text style = {styles.childContainerText}>Organizer : {this.state.org} {'\n'} Contact No. : {this.state.contact}</Text>
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'center',marginRight : '4%', marginTop : '5%'}}>
            <Text style = {{flex : 1 ,alignSelf : 'flex-start',marginLeft : '9%', fontWeight : 'bold', fontSize : 18}}>8 people are going</Text>
          </View>
          <View style = {{flexDirection : 'row',justifyContent : 'flex-start',alignSelf : 'flex-start',marginLeft : '8%', marginRight : '6%', marginTop : '3%',flexWrap: 'wrap'}}>
            <Avatar
              size = "small"
              rounded
              title ="BS"
              containerStyle = {styles.avatar}
            />
            <Avatar
              size = "small"
              rounded
              title ="BS"
              containerStyle = {styles.avatar}
            />
            <Avatar
              size = "small"
              rounded
              title ="BS"
              containerStyle = {styles.avatar}
            />
            <Avatar
              size = "small"
              rounded
              title ="BS"
              containerStyle = {styles.avatar}
            />
            <Avatar
              size = "small"
              rounded
              title ="BS"
              containerStyle = {styles.avatar}
            />
          </View>
          <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'center',marginRight : '10%', marginTop : '6%'}}>
            <Text style = {{flex : 1 ,alignSelf : 'flex-start',marginLeft : '10%', fontWeight : 'normal', fontSize : 15}}>{this.state.description}</Text>
          </View>
        </ScrollView>
     )
  }
}
 // <Divider style = {{backgroundColor : Colors.primaryAppColor,borderWidth : 1}}/>
// source = {require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/cool-one-piece-wallpaper_011523568_277.png')}
 const styles = StyleSheet.create({
  Container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryBackGourndColor,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'center',
    width : '100%',
    paddingBottom : 40,
  },
  buttonContainer : {
    //backgroundColor : Colors.primaryAppColor,
    //paddingVertical : 20,
    margin : 20,
    alignSelf : 'center',
    width : '80%',
    color : Colors.primaryAppColor,
    //alignSelf : 'center',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
  childContainer1 : {
    //flex : 1,
    flexDirection : 'row',
    justifyContent: 'space-around',
    alignSelf : 'center',
    marginRight : '12%',
    marginTop : '7%',
  },
  childContainer2 : {
    flex : 1,
    flexDirection : 'row',
    justifyContent: 'flex-start',
    //alignSelf : 'flex-start',
    margin : 5,
  },
  childContainerText : {
    flex : 1,
    fontSize : 15,
    alignSelf : 'center',
    textAlign : 'center',
  },
  title : {
    //flex : 1,
    fontSize : 22,
    alignSelf : 'center',
    textAlign : 'center',
    marginRight : '2%',
    marginLeft : '2%',
    marginTop : '3%',
    fontWeight : '300',
    color : '#000000',
  },
  title1 : {
    flex : 1 ,
    fontSize : 15,
    alignSelf : 'flex-start',
    marginLeft : 40,
    fontWeight : 'normal',
  },
  avatar : {
    marginRight : '4%',
  }
});
