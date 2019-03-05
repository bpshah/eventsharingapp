import React, { Component } from 'react'
import {  ActivityIndicator,  AppRegistry,  StyleSheet,  Text,  View} from 'react-native';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';


export default class Activity extends Component {
  render(){
    return(
      <View styles = {{flex : 1,justifyContent : 'center',alignItems : 'center',flexDirection : 'column'}}>
        <ActivityIndicator  size = "large"
                            color = {Colors.primaryAppColor}
                            animating
                            style = {{flex : 1,justifyContent : 'center', marginTop : '50%',alignSelf : 'center'}}/>
      </View>
    );
  }
}
