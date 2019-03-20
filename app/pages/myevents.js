import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback,ToastAndroid} from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Activity from '../components/activityIndicator.js'

export default class MyEvents extends Component {

  constructor(props){
    super(props);
    this.state = {
      datasrc : null,
      loading : true,
      refreshing : false,
    }
  }

  componentWillMount(){
    this.handleRefresh();
  }

  componentDidMount(){
    this.handleRefresh();
  }

  handleRefresh = () => {

    this.setState({
      refreshing : true,
      loading : true,
    })
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    let data1 = [];
    firebase
      .database()
      .ref('Events/')
      .orderByChild("uid")
      .equalTo(temail)
      .on('value',(snapshot) => {
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            data1.push(item)
        })
        this.setState({
          datasrc : data1,
          refreshing : false,
        })
      })
      if(this.state.datasrc != []){
        this.setState({
          loading : false,
        })
      }
      else {
        ToastAndroid.showWithGravity( 'Unanble to get events.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
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
    title : 'My Events',
    headerTintColor : Colors.white,
    headerLeft : (
      <View marginLeft = {10}>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Icon1 name="ios-arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
      </View>
    )
  })

  render(){
    return(
      <FlatList
          data = {this.state.datasrc}
          refreshing = {this.state.refreshing}
          onRefresh = {this.handleRefresh}
          renderItem={({item})=>(
          <View style={{flex : 1,backgroundColor : Colors.primaryBackGourndColor}}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('EditEvent',{  title : item.eventname,
                                                                      desc : item.description,
                                                                      organizer : item.org,
                                                                      place : item.place,
                                                                      fromtime : item.fromtime,
                                                                      totime : item.totime,
                                                                      imgsrc : item.imgsrc,
                                                                      contact : item.mobileno,
                                                                      category : item.category})} >
              <Card containerStyle = {styles.Container}
                    dividerStyle = {{backgroundColor : Colors.cardTextColor}}
                    title = {item.eventname}
                    titleStyle = {styles.title}
                    titleNumberOfLines = {2}>
                <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : Colors.cardTextColor}}>By : {item.org} At : {item.place} {"\n"}</Text>
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
  desc : {
    alignSelf : 'flex-start' ,
  },
});
