import React, { Component } from 'react'
import {  ActivityIndicator,  AppRegistry,  StyleSheet,  Text,  View} from 'react-native';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';


export class Activity extends Component {
  render(){
    return(
      <View styles = {{flex : 1,justifyContent : 'center'}}>
        <ActivityIndicator size="small" color={Colors.primaryAppColor} />
      </View>
    );
  }
}
