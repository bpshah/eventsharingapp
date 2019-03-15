import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback, BackHandler, Alert,ActivityIndicator} from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, withNavigationFocus, DrawerActions, } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Activity from '../components/activityIndicator.js'
import type { RemoteMessage,Notification } from 'react-native-firebase';
//import functions from "firebase-functions";
//eimport admin from "firebase-admin";
//let data = []
export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      datasrc : null,
      refreshing : false,
      loading : false,
    }

  }

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'justify',
       flex : 1,
       fontSize : 20,
     },
    headerStyle : {
      backgroundColor : Colors.tabBarColor,
    },
    title : 'Events',
    headerTintColor : Colors.white,
    headerLeft : (
      <View marginLeft = {10}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Icon name="bars" size={20} color={Colors.white} />
          </TouchableOpacity>
      </View>
    )
  })

  componentWillMount(){
  
  }

  componentDidMount(){
    this.handleRefresh();

    this.unsubscribeFromNotificationListener = firebase.notifications().onNotification(notification => {
	     console.log('Notification received!', notification);
       const localNotification = new firebase.notifications.Notification({
            sound : 'default',
            show_in_foreground : true,
          })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('channelId') // e.g. the id you chose above

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.log(err));
      })

    }
    componentWillUnmount(){
      this.handleRefresh();
    }

  handleRefresh = () => {

    this.setState({
      //datasrc : null,
      refreshing : true,
      loading : true,
    })
    //console.log("data src null :" + this.state.datasrc);
    let data1 = [];
    firebase
      .database()
      .ref('Events/')
      .on('value',(snapshot) => {
        //console.log("Before Parsing");
        //console.log("New Snapshot : " + snapshot);
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //item.key = csnapshot.key;
            data1.push(item)
        })
        //console.log("After Parsing");
        this.setState({
          datasrc : data1,
          refreshing : false,
          loading : false,
        });
        //console.log("Refreshed : " + this.state.datasrc);
      })
    }

  render(){

      const {navigate} = this.props.navigation;

      if (this.state.loading) {
        return (
          <Activity/>
        );
      }

      return(

        <FlatList
            data = {this.state.datasrc}
            refreshing = {this.state.refreshing}
            onRefresh = {this.handleRefresh}
            renderItem={({item})=>(
            <View style={{flex : 1,backgroundColor : Colors.primaryBackGourndColor}}>
              <TouchableWithoutFeedback onPress={() => navigate('Ex',{  title : item.eventname,
                                                                        desc : item.description,
                                                                        organizer : item.org,
                                                                        place : item.place,
                                                                        fromtime : item.fromtime,
                                                                        totime : item.totime,
                                                                        imgsrc : item.imgsrc,
                                                                        contact : item.mobileno,})} >
                <Card containerStyle = {styles.Container}
                      dividerStyle = {{backgroundColor : Colors.cardTextColor}}
                      title = {item.eventname}
                      titleStyle = {styles.title}
                      titleNumberOfLines = {2}>
                  <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : Colors.cardTextColor}}>From : {item.fromtime} {"\n"}</Text>
                  <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : Colors.cardTextColor}}>To : {item.totime} {"\n"}</Text>
                  <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : Colors.cardTextColor}}>{item.place} {"\n"}</Text>
                  <Text style = {styles.desc}>Organizer : {item.org} {"\n"}</Text>
                  <Text style = {styles.desc}>Contact : {item.mobileno} {"\n"}</Text>
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
    backgroundColor : Colors.primaryBackGourndColor,
    marginBottom : 10,
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
