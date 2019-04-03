import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View,StyleSheet} from 'react-native';
import { StackNavigator,DrawerActions } from 'react-navigation';
import {Avatar} from 'react-native-elements';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome5.js';

export default class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state = ({
      imgsrc : null,
      firsname : null,
      lastname : null,
    })
  }

  navigateToScreen = (route) => () => {
   const navigateAction = NavigationActions.navigate({
     routeName: route
   });
   this.props.navigation.dispatch(navigateAction);
}

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

  render(){
    return(
      <ScrollView>
        <View style = {{flex : 1,backgroundColor : Colors.white,justifyContent : 'flex-start',alignItems : 'center',paddingBottom : '20%'}}>
          <Avatar
              rounded
              source = {{uri : this.state.imgsrc}}
              //style = {{backgroundColor : 'black'}}
              size = "large"
              paddingTop = '10%'
              paddingLeft = '2%'
              paddingRight = '2%'
          />
          <Text style = {{paddingTop : '14%',fontSize : 17,alignSelf : 'center',flex : 1}}> Welcome , {this.state.firsname} </Text>
        </View>
        <View style = {{flex : 2,backgroundColor : Colors.primaryBackGourndColor,paddingTop : '5%',height : '65%'}}>
          <View style = {{ flexDirection : 'row',justifyContent : 'flex-start',paddingTop : '6%',paddingBottom : '6%'}}>
            <Icon name="plus-square"
              size={18}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',alignSelf : 'center'}}/>
            <Text style = {{ justifyContent : 'flex-start',fontSize : 17,marginLeft : '12%',alignSelf : 'center'}}
                  onPress={this.navigateToScreen('EventCreate')}>Create Event</Text>
          </View>
          <View style = {styles.child1}>
            <Icon name="user-plus"
              size={18}
              color='black'
              style = {{paddingLeft : '10%',marginRight : '1%',alignSelf : 'center'}}/>
            <Text style = {{ justifyContent : 'flex-start',fontSize : 17,marginLeft : '12%',alignSelf : 'center'}}
                  onPress={this.navigateToScreen('CreateGroup')}>Create Group</Text>
          </View>
          <View style = {styles.child1}>
            <Icon name="plus"
              size={18}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',alignSelf : 'center'}}/>
            <Text style = {{ justifyContent : 'flex-start',fontSize : 17,marginLeft : '12%',alignSelf : 'center'}}
                  onPress={this.navigateToScreen('ProfilePage')}>Join Group</Text>
          </View>
          <View style = {styles.child1}>
            <Icon name="user"
              size={18}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',alignSelf : 'center'}}/>
            <Text style = {{ justifyContent : 'flex-start',fontSize : 17,marginLeft : '12%',alignSelf : 'center'}}
                  onPress={this.navigateToScreen('ProfilePage')}>Profile</Text>
          </View>
          <View style = {styles.child1}>
            <Icon name="sign-out-alt"
              size={18}
              color='black'
              style = {{marginLeft : '10%',marginRight : '4.5%',alignSelf : 'center'}}/>
            <Text style = {{ justifyContent : 'flex-start',fontSize : 17,marginLeft : '12%',alignSelf : 'center'}}
                  onPress = {() => firebase.auth().signOut().then((this.props.navigation.navigate('Login')))}>Logout</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  child1 : {
     flexDirection : 'row',
     justifyContent : 'flex-start',
     paddingTop : '4%',
     paddingBottom : '6%'
  }
})
