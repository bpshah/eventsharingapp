import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback,ToastAndroid} from 'react-native';
import { List, ListItem, Card, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import Icon1 from 'react-native-vector-icons/Ionicons.js';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Activity from '../components/activityIndicator.js'

export default class Going extends Component {

  constructor(props){
    super(props);
    this.state = {
      datasrc : null,
      loading : true,
      refreshing : false,
      value : '',
      searchArrayHolder : [],
      tmpdata : null
    }
  }

  static navigationOptions = ({navigation}) => ({
    header : null,
  })

  componentWillMount(){
    this.handleRefresh();
  }

  componentDidMount(){
    this.handleRefresh();
  }

  // empty component for flatlist
  emptyComp = () => {
    return(
      <View style = {{flex : 1,justifyContent : 'center',alignItems : 'center'}}>
        <Text style = {{fontSize : 16}}>No events</Text>
      </View>
    )
  }

  // search function to search for events
  searchFilter = (text) => {

    this.setState({
      value : text,
    });

    const data = this.state.tmpdata
    const newData = this.state.searchArrayHolder.filter(item => {
      return Object.keys(item).some(key =>
        item[key].includes(text)
      );
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

  // component for serachbar header
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

  // function to fetch event to which user is going to
  handleRefresh = () => {

    this.setState({
      refreshing : true,
      loading : true,
    })
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');
    let data1 = [];
    this.setState({
        datasrc : data1,
    })
    firebase
      .database()
      .ref('Users/' + temail1 + '/' + 'going')
      .once('value')
      .then(async (snapshot) => {
        this.setState({
          loading : false,
        })
          let keys = snapshot._childKeys;
          console.log(keys);
            await keys.forEach((item) => {
              firebase
                .database()
                .ref('Events/')
                .child(snapshot._value[item].ename)
                .once('value')
                .then((snapshot) => {
                  data1.push(snapshot._value);
                })
                .then(() => {
                  this.setState({
                    datasrc : data1,
                    refreshing : false,
                    loading : false,
                    searchArrayHolder : data1,
                    tmpdata : data1
                  })
                })
            })
      })
    }

  // function to check expiration of event based on its starting data
  showcurrentDate = (d) => {
      let time = new Date().getTime();
      let temp = d.split(" ",3);
      temp[1] = temp[1].replace(",","")
      if(temp[1].length == 1){
        temp[1] = '0' + temp[1];
      }
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
      if(eventtime < time/1000){
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
          ListHeaderComponent = {this.searchBarHeader}
          ListEmptyComponent = {this.emptyComp}
          ItemSeparatorComponent={this.renderSeparator}
          initialNumToRender = {5}
          renderItem={({item})=>(
          <View style={{flex : 1,backgroundColor : Colors.primaryBackGourndColor}}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Ex',{  title : item.eventname,
                                                                      desc : item.description,
                                                                      organizer : item.org,
                                                                      place : item.place,
                                                                      fromtime : item.fromtime,
                                                                      totime : item.totime,
                                                                      imgsrc : item.imgsrc,
                                                                      contact : item.mobileno,
                                                                      category : item.category,
                                                                      })} >
              <Card containerStyle = {styles.Container}
                    titleNumberOfLines = {2}>
                <View style = {{flex : 1,flexDirection : 'column',justifyContent : 'space-around'}}>
                  <View style = {{marginLeft : 0}}>
                    <Text style = {{alignSelf : 'flex-start', fontSize : 18, color : Colors.primaryAppColor,marginBottom : '2%'}}>{item.eventname}</Text>
                    <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : 'black',marginBottom : '0%'}}>City : {item.place}</Text>
                    <Text style = {{alignSelf : 'center', fontSize : 15, color : 'black',textAlign : 'left'}}>{item.fromtime} onwards</Text>
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
