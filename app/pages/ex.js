import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
//import Ev from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Events.js';
import { Button, Avatar, Divider } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';


export default class Ex extends Component {
  static navigationOptions = ({navigation}) =>({
    headerTitleStyle : {
       textAlign : 'justify',
       flex : 1,
       },
    title : 'Events',
    headerTintColor : Colors.white,
    headerStyle : {
      backgroundColor : Colors.tabBarColor,
    },
    headerLeft : (
      <View marginLeft = {10}>
        <Icon name="angle-left" size={30} color={Colors.white} onPress={() => navigation.navigate('Events')}/>
      </View>
    )
  })
  render(){
       return(
       <ScrollView contentContainerStyle = {styles.Container}
                   behaviour = 'height'>
          <View containerStyle = {styles.childContainer1}>
            <Text style = {styles.title}>Anime Meet</Text>
          </View>
          <Avatar
            rectangle
            source = {require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/cool-one-piece-wallpaper_011523568_277.png')}
            height = {175}
            width = '100%'
            margin = '2%'
            alignSelf = 'center'
            backgroundColor = '#F2F2F2'
            imageProps = {{resizeMode : 'stretch'}}/>
          <Divider containerStyle = {{backgroundColor : Colors.primaryAppColor,borderWidth : 1}}/>
          <Button title = 'JOIN AND RSVP'
                    containerStyle = {styles.buttonContainer}/>
          <View style = {styles.childContainer1}>
            <Icon name="clock"
                  size={20}
                  color='black'
                  style = {{marginRight : '2.75%', marginLeft : '10%',marginBottom : '1%',alignSelf : 'center'}}/>
            <Text style = {styles.childContainerText}>Monday , 27 Feb 16:30 PM - 18:30 PM</Text>
          </View>
          <View style = {styles.childContainer1}>
            <Icon name="map-marker-alt"
                size={20}
                color='black'
                style = {{marginRight : '4%', marginLeft : '10%',marginBottom : '1%',alignSelf : 'center'}}/>
            <Text style = {styles.childContainerText}>SEAS, Ahmedabad University, Navarangpura - 380015, Ahmedabad , India</Text>
          </View>
          <View style = {styles.childContainer1}>
            <Icon name="user"
                size={20}
                color='black'
                style = {{marginRight : '4%', marginLeft : '10%',alignSelf : 'center'}}/>
            <Text style = {styles.childContainerText}>Hosted by Bhumit Pratishkumar Shah, Seas Ahmedabad, India ,Gujarat</Text>
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
            <Text style = {{flex : 1 ,alignSelf : 'flex-start',marginLeft : '10%', fontWeight : 'normal', fontSize : 15}}>Anime Meet</Text>
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
    height : 800,
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
