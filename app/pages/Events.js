import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableWithoutFeedback, BackHandler, Alert,ActivityIndicator} from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, withNavigationFocus, DrawerActions, } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';
import Colors from 'C:/Users/DELL/Documents/EventSharingSystem/app/styles/colors.js';
import Activity from 'C:/Users/DELL/Documents/EventSharingSystem/app/components/activityIndicator.js'

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
      events : null,
      refreshing : false,
      loading : true,
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
          <Icon name="bars" size={20} color={Colors.white} onPress={() => navigation.toggleDrawer()}/>
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
          loading : false,
        });
        console.log("Events : ",this.state.events);
      })
      /*.then( () => {
        this.setState({
          loading : false,
        })
      });*/
      console.log("After Fetch");
      data = [];
    }

  /*componentDidMount(){
    this.setState({
      events : {}
    })
    this.handleRefresh();
  }*/

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
      refreshing : true,
    })

    let data = [];

    firebase
      .database()
      .ref('Events/')
      .on('value',(snapshot) => {
        //console.log("Before Parsing");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            item.key = csnapshot.key;
            data.push(item)
        })
        //console.log("After Parsing");
        this.setState({
          events : data,
          refreshing : false,
        });
        //console.log("E1 : ",this.state.events[0]['uid']);
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
            data = {this.state.events}
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

//export default withNavigationFocus(Events);
//onPress={() => this.props.navigation.navigate('Ex')}

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
