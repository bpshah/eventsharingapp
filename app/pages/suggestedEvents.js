import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback,ToastAndroid, NetInfo} from 'react-native';
import { List, ListItem, Card, Avatar, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Activity from '../components/activityIndicator.js'
import type { RemoteMessage,Notification } from 'react-native-firebase';
export default class SuggestedEvents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      datasrc : null,
      refreshing : false,
      loading : false,
      value : '',
      isConnected : true,
      searchArrayHolder : [],
      eventcatdata : [],
      userCats : [],
      tmpdata : null
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
    this.getUserInterests().then(() => {
      this.getEventData();
    });
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    this.getUserInterests().then(() => {
      this.getEventData();
    });
    //this.getEventData();
  }

  componentWillUnmount(){
      //this.getEventData();
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
    const newData = this.state.searchArrayHolder.filter(item => {
      const itemData = `${item.eventname}`
      console.log(itemData)
      return itemData.indexOf(text) > -1
    });

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

  getUserInterests = async () => {

    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');
    await firebase
      .database()
      .ref('Users/' + temail1 + '/' + 'tcats')
      .on('value',(snapshot) => {
        //console.log(snapshot._value);
        this.setState({
          userCats : snapshot._value,
        })
        //console.log(" USerCats: " + this.state.userCats);
      })
  }

  getEventData = () => {

    this.setState({
      refreshing : true,
      loading : true,
    })
    let eventdata = [];

    firebase
      .database()
      .ref('Cats/')
      .once('value')
      .then((snapshot) => {
        snapshot._childKeys.forEach((item) => {
          firebase
            .database()
            .ref('Cats/' + item)
            .once('value')
            .then((csnapshot) => {
              let count = 0;
              for(i = 0;i<this.state.userCats.length;i++){
                if(csnapshot._value.tcats.includes(this.state.userCats[i])){
                  count++;
                }
              }
              if(count > 0){
                firebase
                  .database()
                  .ref('Events/' + item)
                  .once('value')
                  .then((snapshot) => {
                    eventdata.push(snapshot.val())
                  })
                  .then(() => {
                    this.setState({
                      datasrc : eventdata,
                      tmpdata : eventdata,
                    })
                  })
              }
            })
            .then(() => {
              this.setState({
                loading : false,
                refreshing : false,
              })
            })
        })
      });
  }

  render(){

      const {navigate} = this.props.navigation;
      console.log(this.state.datasrc);
      //this.getEventData();

      if(!this.state.isConnected){
        return(
          <Text style = {{flex : 1,alignSelf : 'center',padding : 20}}>No internet connection</Text>
        );
      }
      return(

        <FlatList
            data = {this.state.datasrc}
            refreshing = {this.state.refreshing}
            onRefresh = {this.getEventData}
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
