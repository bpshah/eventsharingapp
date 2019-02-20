/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Login from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Login.js';
import Signup from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Signup.js';
import FPassword from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/FPassword.js';
import SplashScreen from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Splashscreen.js';
import Events from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/Events.js';
import Ex from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/ex.js';
import ProfilePage from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/ProfilePage.js';
import EventCreate from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/EventCreate.js';
import { createStackNavigator, createAppContainer, createBottomTabNavigator, createDrawerNavigator, DrawerItems, DrawerActions } from 'react-navigation';
import firebase from 'react-native-firebase';

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

//console.disableYellowBox = true;

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
    initialRouteName : 'Events',
})

const logoutDrawer = createDrawerNavigator(
{
      mainpage : {
        screen : Events
      },
},
{
  contentComponent : (props) => (
  <View style = {{flex : 1}}>
    <DrawerItems {...props} />
    <Button title = "Logout"
            onItemPress={() => this.props.navigation.navigate('Login')}/>
  </View>
),
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle'
})

const ProfileStack = createStackNavigator({
  ProfilePage : {
    screen : ProfilePage,
  },
})

export const TabNav = createBottomTabNavigator(
    {
      EventStack : {
          screen : EventStack,
          navigationOptions : {
          tabBarLabel : "Events",
          tabBarIcon : ({ tintColor }) => (
            <Icon name="stream" size={20} color="#900" />
          ),
        },
      },
      ProfileStack : {
        screen : ProfileStack,
        navigationOptions : {
        tabBarLabel : "Profile",
        tabBarIcon : ({ tintColor }) => (
          <Icon name="user" size={20} color="#900" />
        ),
        tabBarVisible : true,
      }
    },
  },
  {
    order : ['EventStack', 'ProfileStack'],
    tabBarOptions : {
      activeTintColor : '#D4AF37',
      inactiveTintColor : 'gray',
      style: {
        backgroundColor : 'white',
      }
    },
  },
);

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
  TabNav : {
      screen : TabNav,
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

const App1 = createStackNavigator({
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
});

const App =  createAppContainer(App1);

export default App;
