import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableWithoutFeedback, BackHandler, Alert} from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';

export default class Events extends Component {

  constructor(props) {
    super(props);
    /*this.state = { ritems : [
      {key : 'Event',image : require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png'), time : 'Thu, 24 Feb', place : 'SEAS, AU',org : 'PClub', contact : '9824213232',description : 'This is default event'},
      {key : 'Event2',image : require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
      {key : 'Event3',image : require('C:/Users/DELL/Documents/EventSharingSystem/app/assets/logo.png'), time : 'default',place : 'default',org : 'default', contact : 'xxxxxxxxxx',description : 'This is default event'},
    ]
  };*/
    this.state = {
      events : {},
      refreshing : false,
    }
  }

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'center',
       flex : 1,
       fontSize : 20,
     },
    headerStyle : {
      backgroundColor : Colors.tabBarColor,
    },
    title : 'Events',
    headerTintColor : Colors.white,
    headerRight : (
      <View marginRight = {10}>
        <Icon name="sign-out-alt" size={20} color={Colors.white} onPress = {() => firebase.auth().signOut().then((navigation.navigate('Login')))}/>
      </View>

    ),
    headerLeft : (
      <View marginLeft = {10}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('EventCreate')} >
          <Icon id = {1} name="plus" size={20} color={Colors.white} />
        </TouchableWithoutFeedback>
      </View>
    )
  })

  /*shouldComponentUpdate(nextState){
    return nextState.events !== this.state.events;
  }

  componentWillUpdate(nextProps,nextState){
    if(shouldComponentUpdate(nextState)){

    }
  }*/

  componentWillMount(){

    console.log("In Mount");
    let data = [];
    firebase
      .database()
      .ref('Events/')
      .on('value',(snapshot) => {
        console.log("Before Parsing");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            item.key = csnapshot.key;
            data.push(item)
        })
        console.log("After Parsing");
        console.log("Data:" + data);
        this.setState({
          events : data,
        });
        console.log("E1 : ",this.state.events);
      })
      console.log("After Fetch");
      data = [];
    }
  /*componentDidMount(prevProps){
    if (prevProps.isFocused !== this.props.isFocused) {
      // Use the `this.props.isFocused` boolean
      // Call any action
      this.setState{
        events : {},
      }
    }
  }
  componentWillUnmount(){
    this.setState({
      events : {},
    })
  }*/
  handleRefresh = () => {

    this.setState({
      refreshing : true
    })

    let data = [];

    firebase
      .database()
      .ref('Events/')
      .on('value',(snapshot) => {
        console.log("Before Parsing");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            item.key = csnapshot.key;
            data.push(item)
        })
        console.log("After Parsing");
        this.setState({
          events : data,
          refreshing : false,
        });
        console.log("E1 : ",this.state.events[0]['uid']);
      })
    }

  render(){
      return(
        <FlatList
            data = {this.state.events}
            refreshing = {this.state.refreshing}
            onRefresh = {this.handleRefresh}
            renderItem={({item})=>(
              <View style={{flex : 1,backgroundColor : Colors.primaryBackGourndColor}}>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Ex')} >
                  <Card containerStyle = {styles.Container}
                        dividerStyle = {{backgroundColor : Colors.cardTextColor}}
                        title = {item.eventname}
                        titleStyle = {styles.title}
                        titleNumberOfLines = {2}>
                    <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : Colors.cardTextColor}}>{item.time} {"\n"}</Text>
                    <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : Colors.cardTextColor}}>{item.place} {"\n"}</Text>
                    <Text style = {styles.desc}>Place : {item.org} {"\n"}</Text>
                    <Text style = {styles.desc}>Contact : {item.mobileno} {"\n"}</Text>
                  </Card>
                </TouchableWithoutFeedback>
              </View>
            )}
        />
    );
  }
}

//export default withNavigationFocus(Events);

const styles = StyleSheet.create({
  Container : {
    //flex : 1,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    backgroundColor : Colors.primaryBackGourndColor,
    marginBottom : 1,
  },
  title : {
    fontSize : 20,
    color : Colors.primaryAppColor,
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
