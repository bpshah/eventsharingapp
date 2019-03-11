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
import Login from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/Login.js';
import Signup from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/Signup.js';
import FPassword from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/FPassword.js';
import SplashScreen from 'C:/Users/DELL/Documents/EventSharingSystem/app/components/Splashscreen.js';
import Events from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/Events.js';
import Ex from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/ex.js';
import ProfilePage from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/ProfilePage.js';
import EventCreate from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/EventCreate.js';
import SideMenu from 'C:/Users/DELL/Documents/EventSharingSystem/app/pages/SideMenu.js';
import { createStackNavigator, createAppContainer, createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';


type Props = {};

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
      console.log("Enabled : ", enabled);
      AsyncStorage.getItem('fcmToken').then( fcmtoken => {
          if(!fcmtoken) {
            console.log("Fcmtoken : ", fcmtoken);
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

/*if (enabled) {
    let token = this.getToken();
    console.log("Token : "+ token);
} else {
    this.requestPermission();
}*/

/*try {
    firebase.messaging().requestPermission();
    // User has authorised
    this.getToken();
} catch (error) {
    // User has rejected permissions
    console.log('permission rejected');
}*/

/*let fcmToken = AsyncStorage.getItem('fcmToken');
if (!fcmToken) {
    fcmToken = firebase.messaging().getToken();
    if (fcmToken) {
        // user has a device token
        AsyncStorage.setItem('fcmToken', fcmToken);
    }
}*/

//checkPermission();
console.disableYellowBox = true;

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

    initialRouteName : 'Events',
})

const TabNav = createBottomTabNavigator(
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
);

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
});

const App =  createAppContainer(App1);

export default App;
