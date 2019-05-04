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
    //this.handleRefresh();
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
      .ref('Users/' + temail1 + '/' + 'going')
      .once('value')
      .then(async (snapshot) => {
        //console.log("Snapshot : "  + snapshot);
        //if(snapshot !== null){
          let keys = snapshot._childKeys;
          //console.log(snapshot._childKeys);
          //console.log(snapshot);
          await keys.forEach((item) => {
            //console.log(snapshot._value[item].ename);
            firebase
              .database()
              .ref('Events/')
              .child(snapshot._value[item].ename)
              .once('value')
              .then((snapshot) => {
                //console.log(snapshot);
                data1.push(snapshot._value);
                //console.log(data1);
              })
              .then(() => {
                this.setState({
                  datasrc : data1,
                  refreshing : false,
                  loading : false,
                  searchArrayHolder : data1,
                  tmpdata : data1
                })
                //console.log("datasrc : " + this.state.datasrc);
              })
          })
        //}
      })
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
