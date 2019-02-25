import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableWithoutFeedback, BackHandler, Alert} from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';

export default class Events extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'center',
       flex : 1,
     },
    headerStyle : {
      backgroundColor : '#E96A69',
    },
    title : 'Events',
    headerTintColor : '#FFFFFF',
    headerRight : (
      <View marginRight = {10}>
        <Icon name="sign-out-alt" size={30} color="#FFFFFF" onPress = {() => firebase.auth().signOut().then((navigation.navigate('Login')))}/>
      </View>

    ),
    headerLeft : (
      <View marginLeft = {10}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('EventCreate')} >
          <Icon id = {1} name="plus" size={20} color="#FFFFFF" />
        </TouchableWithoutFeedback>
      </View>
    )
  })

  constructor(props) {
    super(props);
    this.state = { ritems : [
      {key : 'Event',image : require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png'), time : 'Thu, 24 Feb', place : 'SEAS, AU',org : 'PClub', contact : '9824213232',description : 'This is default event'},
      {key : 'Event2',image : require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
      {key : 'Event3',image : require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
    ]
      };
  }

  render(){
      return(
        <FlatList
            data = {this.state.ritems}
            renderItem={({item})=>(
              <View style={{flex : 1,backgroundColor : '#F2F2F2'}}>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Ex')} >
                  <Card containerStyle = {styles.Container}
                        dividerStyle = {{backgroundColor : '#808080'}}
                        title = {item.key}
                        titleStyle = {styles.title}
                        titleNumberOfLines = {2}>
                    <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : '#808080'}} fontSize = {15} color = '#808080'>{item.time} {"\n"}</Text>
                    <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : '#000000'}}>{item.place} {"\n"}</Text>
                    <Text style = {styles.desc}>Place : {item.org} {"\n"}</Text>
                    <Text style = {styles.desc}>Contact : {item.contact} {"\n"}</Text>
                  </Card>
                </TouchableWithoutFeedback>
              </View>
            )}
        />
    );
  }
}

const styles = StyleSheet.create({
  Container : {
    //flex : 1,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    backgroundColor : '#FFFFFF',
    marginBottom : 1,
  },
  title : {
    fontSize : 20,
    color : '#E96A69',
    alignSelf : 'flex-start'
  },
  imageWrapper : {

  },
  imageS : {

  },
  imageP : {
    resizeMode : 'stretch',
    alignSelf : 'flex-start',
    margin : 10,
  },
  dividerStyle : {

  },
  desc : {
    alignSelf : 'flex-start' ,
  },

});
