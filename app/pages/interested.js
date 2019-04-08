import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text, StatusBar,ToastAndroid} from 'react-native';
import { CheckBox } from 'react-native-elements';

import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';

export default class Interested extends Component{

  constructor(props){
    super(props);
    this.state = {
      categories : [],
      checked : [],
      loading : false,
      email : this.props.navigation.state.params.email,
    }
  }

  componentWillMount(){
    firebase
      .database()
      .ref('Catgory/')
      .once('value').then((snapshot) => {
        //console.log("Before Parsing Categories");
        snapshot.forEach((csnapshot) => {
            let item = csnapshot.val();
            //console.log("Category : " + item);
            this.state.categories.push(item);
        });
        console.log("Data 2 : " + this.state.categories);
      })
      .then(() => {
        let check = [];
        this.state.categories.forEach((item) => {
          check.push(false);
        })
        this.setState({
          checked : check,
        })
        console.log("Data 2 : " + this.state.checked);
      })
  }

  static navigationOptions = {
    header : null,
  }

  mapCheckBox = () => {
    let cats = [];
    this.state.categories.forEach((cat) => {
      if(this.state.checked[this.state.categories.indexOf(cat)] === true){
        cats.push(this.state.categories[this.state.categories.indexOf(cat)]);
      }
    })
    return cats;
  }

  handleInterstes = () => {
    let temail = this.state.email.slice(0,this.state.email.indexOf('@'));
    let tcats = this.mapCheckBox();
    console.log(temail + ' ' + tcats);
    this.setState({
      loading : true,
    })
    firebase.database().ref('Users/' + temail).update({tcats}).then(() => {
      this.props.navigation.navigate('Login');
      this.setState({
        loading : false,
      })
    });
  };

  render(){
    console.log("in render of Interested");
    return(
      <View style = {styles.container}>
      <StatusBar barStyle = 'light-content'/>
      <Text style={{color: Colors.textColor, fontSize : 20, marginTop : '10%'}}>Your Interestes : {"\n"}
      </Text>

      <View style = {{flexDirection : 'row',justifyContent: 'flex-start',alignSelf : 'flex-start',marginTop : '1%',marginLeft : '0%',
      flexWrap: 'wrap'}}>
      {
        this.state.categories.map((item,index) => {
        console.log(item + "+" + index)
        return (
          <CheckBox
            title = {item}
            checked = {this.state.checked[index]}
            onPress = {() => {
              let check = this.state.checked
              check[index] = !check[index]
              this.setState({
                checked : check
              })
              console.log("State : ", this.state.checked);
            }}
            containerStyle = {{backgroundColor : Colors.primaryAppColor,borderWidth : 0,padding : 0}}
          />
      )
      })}
      </View>

      <TouchableOpacity style = {styles.buttonContainer}
                        onPress={this.handleInterstes}>
            <Text style = {styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      </View>

    );
  }
}


const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : Colors.primaryAppColor,
    padding : 20,
    justifyContent : 'flex-start',
    //height : 500,
  },
  input : {
    height : 40,
    backgroundColor : Colors.inputBackgroundColor,
    marginBottom : '6%',
    marginTop : '1%',
    paddingHorizontal : 15,
    borderBottomWidth : 0.75,
    color : Colors.inputColor,
  },
  buttonContainer : {
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
});
