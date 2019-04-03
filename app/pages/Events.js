import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback,ToastAndroid, NetInfo} from 'react-native';
import { List, ListItem, Card, Avatar, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Activity from '../components/activityIndicator.js'
import type { RemoteMessage,Notification } from 'react-native-firebase';
export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      datasrc : null,
      refreshing : false,
      loading : false,
      value : '',
      isConnected : false,
      searchArrayHolder : [],
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

    const newData = this.state.searchArrayHolder.filter(item => {
      const itemData = `${item.eventname}`
      return itemData.indexOf(text) > -1
    });

    this.setState({
      datasrc : newData,
    })
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
                                                                        address : item.address})} >
                <Card containerStyle = {styles.Container}
                      titleNumberOfLines = {2}>
                  <View style = {{flex : 1,flexDirection : 'column',justifyContent : 'space-around'}}>
                    <View style = {{marginLeft : 0}}>
                      <Text style = {{alignSelf : 'flex-start', fontSize : 18, color : Colors.primaryAppColor,marginBottom : '2%'}}>{item.eventname}</Text>
                      <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : 'black',marginBottom : '0%'}}>City : {item.place}</Text>
                      <Text style = {{alignSelf : 'center', fontSize : 15, color : 'black',textAlign : 'justify'}}>{item.fromtime} onwards</Text>
                    </View>
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
