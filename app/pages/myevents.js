import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text,TouchableOpacity,TouchableWithoutFeedback,ToastAndroid} from 'react-native';
import { List, ListItem, Card, SearchBar } from 'react-native-elements';
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
      value : '',
      searchArrayHolder : [],
      tmpdata : null
    }
  }

  componentWillMount(){
    this.handleRefresh();
  }

  componentDidMount(){
    this.handleRefresh();
  }

  emptyComp = () => {
    return(
      <View style = {{flex : 1,justifyContent : 'center',alignItems : 'center'}}>
        <Text style = {{fontSize : 16}}>No events</Text>
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

  handleRefresh = () => {

    this.setState({
      refreshing : true,
      loading : true,
    })
    let user = firebase.auth().currentUser;
    const temail = user.email.slice(0,user.email.indexOf('@'));
    let temail1 = temail.replace(/[^a-zA-Z0-9]/g,'');
    let data1 = [];
    firebase
      .database()
      .ref('Events/')
      .orderByChild("uid")
      .equalTo(temail1)
      .on('value',(snapshot) => {
        snapshot.forEach((csnapshot) => {
          //console.log(csnapshot.val());
            let item = csnapshot.val();
            data1.push(item)
        })
        this.setState({
          datasrc : data1,
          refreshing : false,
          searchArrayHolder : data1,
          tmpdata : data1
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
          ListHeaderComponent = {this.searchBarHeader}
          ListEmptyComponent = {this.emptyComp}
          ItemSeparatorComponent={this.renderSeparator}
          initialNumToRender = {5}
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
                                                                      category : item.tcats,
                                                                      limit : item.membersLimit})} >
              <Card containerStyle = {styles.Container}
                    titleNumberOfLines = {2}>
                    <View style = {{flex : 1,flexDirection : 'column',justifyContent : 'space-around'}}>
                      <View style = {{marginLeft : 0}}>
                        <Text style = {{alignSelf : 'flex-start', fontSize : 18, color : Colors.primaryAppColor,marginBottom : '2%'}}>{item.eventname}</Text>
                        <Text style = {{alignSelf : 'flex-start', fontSize : 15, color : 'black',marginBottom : '0%'}}>By : {item.org} {'\n'}City : {item.place}</Text>
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
