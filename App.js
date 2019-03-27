/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,AsyncStorage} from 'react-native';
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


import { createStackNavigator, createAppContainer, createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
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

firebase.messaging().hasPermission()
  .then(enabled => {
    if(enabled){
      //console.log("Enabled : ", enabled);
      AsyncStorage.getItem('fcmToken').then( fcmtoken => {
          if(!fcmtoken) {
            //console.log("Fcmtoken : ", fcmtoken);
            firebase.messaging().getToken().then( (token) => {
                if(token){
                  console.log("Token : ", token);
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

//console.disableYellowBox = true;

const ProfileStack = createStackNavigator({
  ProfilePage : {
    screen : ProfilePage,

  },
})

const EventStack = createStackNavigator({
    Events : {
      screen : Events ,
    },
    Ex : {
      screen : Ex,
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
    MyEvents : {
        screen : MyEvents,
    },
    EditEvent : {
      screen : EditEvent,
    },
    CreateGroup : {
      screen : CreateGroup
    },
    Going : {
      screen : Going,
    },

    initialRouteName : 'Events',
})

/*const TabNav = createBottomTabNavigator(
    {
      EventStack : {
          screen : EventStack,
          navigationOptions : {
          tabBarLabel : "Events",
          tabBarIcon : ({ tintColor }) => (
            <Icon name="stream" size={20} color="#F2F2F2" />
          ),
        },
      },
      ProfileStack : {
        screen : ProfileStack,
        navigationOptions : {
        tabBarLabel : "Profile",
        tabBarIcon : ({ tintColor }) => (
          <Icon name="user" size={20} color="#F2F2F2" />
        ),
        tabBarVisible : false,
      }
    }
  },
  {
    order : ['EventStack', 'ProfileStack'],
    tabBarOptions : {
      activeTintColor : 'black',
      inactiveTintColor : '#F2F2F2',
      style: {
        backgroundColor : 'white',
      }
    },
  },
);*/

const Drawer =  createDrawerNavigator({
  EventStack : {
    screen : EventStack,
  },
},
{
  contentComponent : SideMenu,
  drawerWidth : 225,
})

EventStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

const LoginStack = createStackNavigator({
  Login : {
    screen : Login,
    navigationOptions : {
      header : null,
    },
  },
  Signup : {
    screen : Signup,
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

const App =  createAppContainer(App1);

export default App;
