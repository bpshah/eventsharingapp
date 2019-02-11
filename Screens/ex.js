import React, { Component } from 'react';
import { View, Text, Image, StyleSheet} from 'react-native';
import Ev from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Events.js';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';


export default class Ex extends Component {
  static navigationOptions = ({navigation}) =>({
    headerTitleStyle : {
       //textAlign : '',
       flex : 1,
       },
    title : 'Events',
    headerLeft : (
      <View marginLeft = {10}>
        <Icon name="angle-left" size={30} color="#900" onPress={() => navigation.navigate('Events')}/>
      </View>
    )
  })
  render(){
       //const { navigation } = this.props;
       return(
       <View style = {styles.Container}>
          <Image source = {require('C:/Users/DELL/Documents/EventSharingSystem/images/logo.png')} style = {{height : 150, width : 150,}}/>
          <Text>This is a default event</Text>
       </View>
     )
  }
}

 const styles = StyleSheet.create({
  Container : {
    flex : 1,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'center',
    backgroundColor : '#FFFFFF',
  },
});
