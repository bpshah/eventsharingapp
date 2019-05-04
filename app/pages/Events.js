import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback,ToastAndroid, NetInfo, AsyncStorage} from 'react-native';
import { List, ListItem, Card, Avatar, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Activity from '../components/activityIndicator.js'
import type { RemoteMessage,Notification } from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      datasrc : null,
      refreshing : false,
      loading : false,
      value : '',
      isConnected : true,
      searchArrayHolder : [],
      tmpdata : null,
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
    this.handleRefresh();
    let user = firebase.auth().currentUser;
    const email = user.email;
    const temail = email.slice(0,user.email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');
    AsyncStorage.getItem('token').then(token => {
      //console.log("Token " + token);
      firebase.database().ref('Users/' + temail1).update({token})
    })
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
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
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

  handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      this.setState({ isConnected : true});
    } else {
      this.setState({ isConnected : false});
    }
  }

  emptyComp = () => {
    return(
      <View style = {{flex : 1,justifyContent : 'center',alignItems : 'center'}}>
        <Text style = {{fontSize : 16}}>There are no events currently</Text>
      </View>
    )
  }

  searchFilter = (text) => {

    this.setState({
      value : text,
    });
    const data = this.state.tmpdata

    /*const newData = this.state.searchArrayHolder.filter(item => {
      return Object.keys(item).some(key =>
        item[key].includes(text)
      );
    });*/
    const newData = this.state.searchArrayHolder.filter(item => {
      return Object.keys(item).some(key =>
        item[key].includes(text)
      );
    });

    console.log(newData);
    if(text != ''){
      this.setState({
        datasrc : newData,
      })
    }
    else{
      this.setState({
        datasrc : data,
      })
    }
  }

  onCancleSearch = () => {

    this.setState({
      value : '',
    })
  }

  searchBarHeader = () => {
    return (
      <SearchBar
        placeholder="Search Events..."
        lightTheme
        round
        onChangeText = { text => this.searchFilter(text)}
        onCancel = {this.onCancleSearch}
        platform = 'default'
        value = {this.state.value}
        autoCorrect = {false}
      />
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{ height: 1, width: '86%', backgroundColor: '#CED0CE', marginLeft: '14%'}}
      />
    );
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
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //item.key = csnapshot.key;
            data1.push(item)
            //console.log(item);
        })
        this.setState({
          datasrc : data1,
          refreshing : false,
          searchArrayHolder : data1,
          tmpdata : data1
        })
        //console.log(this.state.datasrc);
      })
      if(this.state.datasrc != []){
        this.setState({
          loading : false,
        })
      }
      else {
        ToastAndroid.showWithGravity( 'Unable to get events.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
      }
    }

  showcurrentDate = (d) => {
    //console.log("In current date");
    let time = new Date().getTime();
    //console.log("Time " + time);
    let temp = d.split(" ",3);
    temp[1] = temp[1].replace(",","")
    if(temp[1].length == 1){
      temp[1] = '0' + temp[1];
    }
    //console.log(temp);
    switch(temp[0]){
      case 'January' :
        temp[0] = '00';
        break;
      case 'February' :
        temp[0] = '01';
        break;
      case 'March' :
        temp[0] = '02';
        break;
      case 'April' :
        temp[0] = '03';
        break;
      case 'May' :
        temp[0] = '04';
        break;
      case 'June' :
        temp[0] = '05';
        break;
      case 'July' :
        temp[0] = '06';
        break;
      case 'August' :
        temp[0] = '07';
        break;
      case 'September' :
        temp[0] = '08';
        break;
      case 'October' :
        temp[0] = '09';
        break;
      case 'November' :
        temp[0] = '10';
        break;
      case 'December' :
        temp[0] = '11';
        break;
    }
    let unixtimet = new Date(Date.UTC(parseInt(temp[2]),parseInt(temp[0]),parseInt(temp[1])));
    let eventtime = unixtimet.getTime()/1000;
    //console.log(typeof(eventtime));
    //console.log("Event Time " + eventtime);
    if(eventtime < time/1000){
      //console.log('in if');
      return(
        <View>
          <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : 'black',textAlign : 'left', color : 'rgba(0,0,0,0.5)'}}>Event Expired</Text>
        </View>
      )
    }
    else {
      //console.log("None");
    }
    //console.log(fulldate);
  }

  render(){

      const {navigate} = this.props.navigation;

      if(!this.state.isConnected){
        return(
          <Text style = {{flex : 1,alignSelf : 'center',padding : 20}}>No internet connection</Text>
        );
      }
      return(

        <FlatList
            data = {this.state.datasrc}
            refreshing = {this.state.refreshing}
            onRefresh = {this.handleRefresh}
            ListHeaderComponent = {this.searchBarHeader}
            ListEmptyComponent = {this.emptyComp}
            ItemSeparatorComponent={this.renderSeparator}
            initialNumToRender = {5}
            renderItem={({item})=>(
            <View style={{flex : 1,backgroundColor : Colors.primaryBackGourndColor}}>
              <TouchableWithoutFeedback onPress={() => navigate('Ex',{  title : item.eventname,
                                                                        desc : item.description,
                                                                        organizer : item.org,
                                                                        place : item.place,
                                                                        fromtime : item.fromtime,
                                                                        totime : item.totime,
                                                                        imgsrc : item.imgsrc,
                                                                        contact : item.mobileno,
                                                                        address : item.address,
                                                                        limit : item.membersLimit})} >
                <Card containerStyle = {styles.Container}
                      titleNumberOfLines = {2}>
                  <View style = {{flex : 1,flexDirection : 'column',justifyContent : 'space-around'}}>
                    <View style = {{marginLeft : 0}}>
                      <Text style = {{alignSelf : 'flex-start', fontSize : 18, color : Colors.primaryAppColor,marginBottom : '2%'}}>{item.eventname}</Text>
                      <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : 'black',marginBottom : '0%'}}>City : {item.place}</Text>
                      <Text style = {{alignSelf : 'center', fontSize : 15, color : 'black',textAlign : 'justify'}}>{item.fromtime} onwards</Text>
                    </View>
                    {this.showcurrentDate(item.fromtime)}
                  </View>

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
    flex : 1,
    alignItems : 'flex-start',
    backgroundColor : Colors.primaryBackGourndColor,
    //marginBottom : -10,
    //height : 75,
  },
  title : {
    fontSize : 18,
    color : Colors.primaryAppColor,
    alignSelf : 'flex-start'
  },
});
