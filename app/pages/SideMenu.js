import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View} from 'react-native';
import { StackNavigator,DrawerActions } from 'react-navigation';
import {Avatar} from 'react-native-elements';
import firebase from 'react-native-firebase';


export default class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state = ({
      imgsrc : null,
      firsname : null,
      lastname : null,
    })
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  navigateToScreen = (route) => () => {
   const navigateAction = NavigationActions.navigate({
     routeName: route
   });
   this.props.navigation.dispatch(navigateAction);
   //this.props.navigation.dispatch(DrawerActions.openDrawer());
   //this.props.navigation.dispatch(DrawerActions.closeDrawer());
   //this.props.navigation.dispatch(DrawerActions.toggleDrawer());
}

/*handleClickOutside = (event) => {
  this.props.navigation.dispatch(DrawerActions.closeDrawer());
}*/

componentWillMount() {
    //addEventListener('mousedown', this.handleClickOutside);
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    firebase
      .database()
      .ref('Users/')
      .child(temail)
      .once('value').then( (snapshot) => {
        //console.log(snapshot.val());
        this.setState({
          imgsrc : snapshot.val().imgsrc,
          firsname : snapshot.val().firstname,
          lastname : snapshot.val().lastname
        })
      })
}

/*componentWillUnmount() {
  removeEventListener('mousedown', this.handleClickOutside);
}*/


  render(){
    return(
      <ScrollView>
        <View style = {{backgroundColor : Colors.white,justifyContent : 'flex-start',alignItems : 'flex-start',height : 200}}>
          <Avatar
              rounded
              source = {{uri : this.state.imgsrc}}
              size = "large"
              marginLeft = '14.5%'
              marginBottom = '8%'
              marginTop = '18%'
              alignSelf = 'flex-start'
          />
          <View>
            <Text style = {{marginLeft : '12%',marginBottom : '1%',marginTop : '0%',fontSize : 17,alignSelf : 'flex-start'}}>{this.state.firsname} {this.state.lastname}</Text>
          </View>
        </View>
        <View style = {{backgroundColor : Colors.primaryBackGourndColor,height : 275}}>
          <View style = {{ flex : 1,justifyContent : 'flex-start',marginTop : '8%',marginBottom : '8%'}}>
            <Text style = {{ justifyContent : 'flex-start',fontSize : 17,marginLeft : '12%'}}
                  onPress={this.navigateToScreen('EventCreate')}>Create Event</Text>
          </View>
          <View style = {{ flex : 1,justifyContent : 'flex-start',marginBottom : '8%'}}>
            <Text style = {{justifyContent : 'flex-start',marginLeft : '12%',fontSize : 17}}
                  onPress={this.navigateToScreen('ProfilePage')}>Create Group</Text>
          </View>
          <View style = {{ flex : 1,justifyContent : 'flex-start',marginBottom : '8%'}}>
            <Text style = {{justifyContent : 'flex-start',marginLeft : '12%',fontSize : 17}}
                  onPress={this.navigateToScreen('ProfilePage')}>Join Group</Text>
          </View>
          <View style = {{ flex : 1,justifyContent : 'flex-start',marginBottom : '8%'}}>
            <Text style = {{justifyContent : 'flex-start',marginLeft : '12%',fontSize : 17}}
                  onPress={this.navigateToScreen('ProfilePage')}>Profile</Text>
          </View>
          <View style = {{ flex : 1,justifyContent : 'flex-start',marginBottom : '8%'}}>
            <Text style = {{justifyContent : 'flex-start',marginLeft : '12%',fontSize : 17}}
                  onPress={this.navigateToScreen('Ex')}>About Us</Text>
          </View>
          <View style = {{ flex : 1,justifyContent : 'flex-start',marginBottom : '8%'}}>
            <Text style = {{justifyContent : 'flex-start',marginLeft : '12%',fontSize : 17,}}
                  onPress = {() => firebase.auth().signOut().then((this.props.navigation.navigate('Login')))}>Logout</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
