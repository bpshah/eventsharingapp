/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,AsyncStorage,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Login from './app/pages/Login.js';
import Signup from './app/pages/Signup.js';
import FPassword from './app/pages/FPassword.js';
import SplashScreen from './app/components/Splashscreen.js';
import Events from './app/pages/Events.js';
import Ex from './app/pages/ex.js';
import ProfilePage from './app/pages/ProfilePage.js';
import EventCreate from './app/pages/EventCreate.js';
import SideMenu from './app/pages/SideMenu.js';
import MyEvents from './app/pages/myevents.js'
import EditEvent from './app/pages/editevent.js'
import CreateGroup from './app/pages/createGroup.js'
import Going from './app/pages/going.js'
import Interested from './app/pages/interested.js'
import SuggestedEvents from './app/pages/suggestedEvents.js'
import { GoogleSignin } from 'react-native-google-signin';
import DropdownMenu from 'react-native-dropdown-menu';
import { Dropdown } from 'react-native-material-dropdown';

import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';


type Props = {};
let isVerified = false;

if(firebase.auth().currentUser === null){
  isVerified = false;
}
else{
  isVerified = firebase.auth().currentUser.emailVerified
}
console.log(isVerified);

const config = {
    apiKey: "AIzaSyAmtO-w9eUbDoeqPe-uI1YkgtRdwB45YWI",
    authDomain: "practice-69846.firebaseapp.com",
    databaseURL: "https://practice-69846.firebaseio.com",
    projectId: "practice-69846",
    storageBucket: "practice-69846.appspot.com",
    messagingSenderId: "273328326983"
  };
firebase.initializeApp(config);
GoogleSignin.configure();
//FacebookSdk.sdkInitialize();

firebase.messaging().hasPermission()
  .then(enabled => {
    if(enabled){
      //console.log("Enabled : ", enabled);
      AsyncStorage.getItem('fcmToken').then( fcmtoken => {
          if(!fcmtoken) {
            //console.log("Fcmtoken : ", fcmtoken);
            firebase.messaging().getToken().then( (token) => {
                if(token){
                  //console.log("Token : ", token);
                  AsyncStorage.setItem('token',token);
                }
              });
          }
        });
    } else {
      firebase.messaging().requestPermission()
        .then(() => {
          AsyncStorage.getItem('fcmToken').then( fcmtoken => {
              if(!fcmtoken) {
                firebase.messaging().getToken().then( (token) => {
                  if(token){
                    AsyncStorage.setItem('token',token);
                  }
                });
              }
            });
          })
        .catch((error) => {
            console.log('Permission Rejected');
      });
    }
  });

console.disableYellowBox = true;

const ProfileStack = createStackNavigator({
  ProfilePage : {
    screen : ProfilePage,
  },
})

const TabNav = createMaterialTopTabNavigator(
    {
      Events : {
        screen : Events,
        navigationOptions : {
        tabBarLabel : "All Events",
      },
    },
      MyEvents : {
        screen : MyEvents,
        navigationOptions : {
        tabBarLabel : "My Events",
      }
    },
    Going : {
      screen : Going,
      navigationOptions : {
      tabBarLabel : "Going",
    },
  },
  SuggestedEvents : {
    screen : SuggestedEvents,
    navigationOptions : {
      tabBarLabel : 'Suggested'
    }
  },
  },
  {
    tabBarOptions : {
      activeTintColor : Colors.primaryAppColor,
      inactiveTintColor : 'black',
      style: {
        backgroundColor : 'white',
      },
      indicatorStyle : {
        backgroundColor: 'rgba(0,0,0,0.4)'
      }
    },
  },
);

 let data = [{
      value : 'Ahmedabad',
    }, {
      value : 'Baroda',
    }, {
      value : 'Surat',
    }];

const EventStack = createStackNavigator({
    TabNav : {
      screen : TabNav ,
      navigationOptions : ({navigation}) => ({
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
        ),
        headerRight : (
          <View marginRight = {25}
                marginTop = {-18}
                >
            <Dropdown
              label = {'Select Location'}
              data = {data}
              itemColor = {'black'}
              selectedItemColor = {'black'}
              containerStyle = {{width : 150}}
              textColor = {'white'}
              disabledItemColor= {'black'}
              width = {50}
              dropdownOffset = {{top : 25}}
              dropdownPosition = {10}
          />
        </View>
        ),
      })
    },
    Ex : {
      screen : Ex,
    },
    Events : {
      screen : Events,
    },
    Going : {
      screen : Going
    },
    EventCreate : {
        screen : EventCreate,
    },
    ProfileStack : {
      screen : ProfileStack,
      navigationOptions :  {
        header : null,
      },
    },
    EditEvent : {
      screen : EditEvent,
    },
    CreateGroup : {
      screen : CreateGroup
    },
    initialRouteName : 'Events',
})

const Drawer =  createDrawerNavigator({
  EventStack : {
    screen : EventStack,
  },
},
{
  contentComponent : SideMenu,
  drawerWidth : 225,
})

const SignupSwitch = createSwitchNavigator({
  Signup : {
    screen : Signup,
    navigationOptions : {
      header : null,
    },
  },
  Interested : {
    screen : Interested,
    navigationOptions : {
      header : null,
    },
  },
})

const LoginStack = createStackNavigator({
  Login : {
    screen : Login,
    navigationOptions : {
      header : null,
    },
  },
  SignupSwitch : {
    screen : SignupSwitch,
    navigationOptions : {
      header : null,
    },
  },
  FPassword : {
    screen : FPassword,
    navigationOptions : {
      header : null,
    }
  },

})

const App1 = createSwitchNavigator({
  SplashScreen : {
    screen : SplashScreen,
    navigationOptions : {
    header : null,
    }
  },
  LoginStack : {
    screen : LoginStack,
    navigationOptions : {
      header : null,
    },
  },
  Drawer : {
    screen : Drawer,
    navigationOptions : {
      header : null,
    },
  },
},
{
    initialRouteName : isVerified ? "Drawer" : "LoginStack"
});

const styles = StyleSheet.create({
    headerText : {
    fontSize : 20,
    margin : 12,
    fontWeight : "bold",
    color : 'white'
  },
  menuContent: {
    color: "#000",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  }
});

const App =  createAppContainer(App1);

export default App;
