import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableWithoutFeedback, BackHandler, Alert, Modal} from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import { Avatar } from "react-native-elements";


export default class Events extends Component {

    static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'center',
       flex : 1,
       },
    title : 'Events',
    headerRight : (
      <View marginRight = {10}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('EventCreate')} >
          <Icon id = {1} name="plus" size={20} color="#900" />
        </TouchableWithoutFeedback>
      </View>

    ),
    headerLeft : (
      <View marginLeft = {10}>
        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Login')} >
          <Avatar
            rounded
            source={require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png')}
            size="small"
            margin = {20}
            alignSelf= 'center'
            showEditButton = {false}
          />
        </TouchableWithoutFeedback>
      </View>
    )
  })
  constructor(props) {
    super(props);
    this.state = { ritems : [
      {key : 'Event',image : require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
      {key : 'Event2',image : require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
      {key : 'Event3',image : require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
    ]
      };
  }

  componentWillMount() {
   BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

  componentWillUnmount() {
   BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}

  backPressed = () => {
  Alert.alert(
    'Exit App',
    'Do you want to exit?',
    [
      {text : 'No', onPress : () => console.log('Cancel Pressed'), style : 'cancel'},
      {text : 'Yes', onPress : () => BackHandler.exitApp()},
    ],
    { cancelable : false });
    return true;
}

  render(){
      return(
        <FlatList
            data = {this.state.ritems}
            renderItem={({item})=>(
              <View style={{flex:1}}>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Ex')} >
                  <Card containerStyle = {styles.Container}
                        title = {item.key}
                        image = {item.image}
                        imageProps = {styles.imageP}
                        titleStyle = {styles.title}
                        titleNumberOfLines = {2}>
                    <Text style = {styles.desc}>Time : {item.time} {"\n"}</Text>
                    <Text style = {styles.desc}>Place : {item.place} {"\n"}</Text>
                    <Text style = {styles.desc}>Organizer : {item.org} {"\n"}</Text>
                    <Text style = {styles.desc}>Contact of Organizer : {item.contact} {"\n"}</Text>
                    <Text style = {styles.desc}>{item.description}{"\n"}</Text>
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
    flex : 1,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    backgroundColor : '#E96A69',
  },
  title : {
    fontSize : 15,
    color : '#FFFFFF',
    alignSelf : 'center'
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
  desc : {
    alignSelf : 'flex-start' ,
    fontSize : 13,
  },

});
