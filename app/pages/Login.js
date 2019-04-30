import React, { Component } from 'react';
import { Button, NetInfo,TextInput, View, StyleSheet, TouchableOpacity,TouchableHighlight, Text, StatusBar, Image, ScrollView, Dimensions,AsyncStorage,ToastAndroid} from 'react-native';
import firebase from 'react-native-firebase';
import Colors from '../styles/colors.js';
import Loader from '../components/loader.js'
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager, LoginButton, FBSDK } from 'react-native-fbsdk';

export default class Login extends Component {

  constructor(props){
    super(props)
    this.state = {
      email : 'bhumit1206@gmail.com',
      password : 'asdf1234',
      errorMessage : null,
      errorCode : null,
      loading : false,
      isConnected : true,
      from : true,
    }
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount(){
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      this.setState({ isConnected : true});
    } else {
      this.setState({ isConnected : false});
    }
  }

  onLayout(e) {
    const {
        nativeEvent : { layout : {height}}} = e;
        this.height = height;
        this.forceUpdate();
      }

  handleLogin = () => {
    const { email, password } = this.state;
    if(email != '' && password != ''){
      if(this.state.isConnected){
        this.setState({
          loading : true,
          from : false
        })
      }
      else{
        this.setState({
          loading : false,
        })
        ToastAndroid.showWithGravity( 'Please connect to internet.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          return res;
        })
        .then((res) => {
            this.setState({
              loading : false,
            })
            //console.log(firebase.auth().currentUser.emailVerified);
            if(!firebase.auth().currentUser.emailVerified){
              ToastAndroid.showWithGravity( 'Email is not verified.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
            }
            else{
              this.props.navigation.navigate("Events");
            }
          })
        .then(() => {this.updateToken()})
        .catch(error => {
              this.setState({ errorMessage : error.message,
                              errorCode : error.code,
                              loading : false,
                });
              console.log(error.code);
              if (this.state.errorCode === 'auth/wrong-password'
                  || this.state.errorCode === 'auth/invalid-email'
                  || this.state.errorCode === 'auth/user-not-found'){
                ToastAndroid.showWithGravity( 'Email/Password is invalid.',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
              }
            })
    }
    else {
      ToastAndroid.showWithGravity( 'Email and Password Fields cannot be empty',ToastAndroid.SHORT,ToastAndroid.BOTTOM,0,50);
    }
    console.log("Logged In");
  }

  googleLogin = () => {
    console.log("in googleLogin");
    let d;
    GoogleSignin
      .signIn()
      .then((data) => {
        // Create a new Firebase credential with the token
        //console.log("Data : ");
        this.setState({
          loading : true,
        })
        console.log("Data : ");
        d = data;
        console.log(data);
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
        return firebase.auth().signInWithCredential(credential)
      })
      .then((user) => {
        //const user = ;
        console.log(user);
        console.log("Data ");
        console.log(d);
        console.log("New User : "+ user.additionalUserInfo.isNewUser);
        this.setState({
          loading : false,
        })
        console.log("Family name "+ d.user.familyName);
        let temp = d.user.givenName.toLowerCase();
        let temp1 = temp.replace(temp.charAt(0),temp.charAt(0).toUpperCase())
        let temp2 = d.user.familyName.toLowerCase();
        let temp3 = temp2.replace(temp2.charAt(0),temp2.charAt(0).toUpperCase())
        console.log(this.state.lastName);
        console.log(this.state.firstname);
        if(user.additionalUserInfo.isNewUser){
          this.props.navigation.navigate('Signup',{
            firstName : temp1,
            lastName : temp3,
            imgsrc : d.user.photo,
            email : d.user.email,
            from : this.state.from,
          })
        }
        else{
          this.props.navigation.navigate('TabNav')
        }
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code + message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
    console.log("logged in ");
}

  facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw new Error('User cancelled request'); // Handle this however fits the flow of your app
      }

      console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

      // login with credential
      const currentUser = await firebase.auth().signInWithCredential(credential);

      console.info(JSON.stringify(currentUser.toJSON()))
    } catch (e) {
      console.error(e);
    }
}

  updateToken = async () => {
    let user = firebase.auth().currentUser;
    const email = user.email;
    const temail = email.slice(0,user.email.indexOf('@'));
    let temail1 = temail1.replace(/[^a-zA-Z0-9]/g,'');
    let token = await AsyncStorage.getItem('token')
    //console.log("In login token : " + token);
    await firebase.database().ref('Users/' + temail1).update({token});
  }

  fromState = () => {
    this.props.navigation.navigate('Signup',{
      from : false,
    })
  }

  render(){
    const {height : heightOfDeviceScreen} = Dimensions.get('window');
    return(
      <ScrollView contentContainerStyle =  {styles.container}>
          <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginTop : '30%',marginRight : '8%',marginLeft : '3%',marginBottom : '-8%'}}>
            <Icon name="envelope"
              size={22}
              color='black'
              style = {{marginLeft : '10%',marginRight : '3.5%',marginBottom : '1%',alignSelf : 'center'}}/>
            <TextInput style = {styles.input}
              title = 'Username'
              placeholder = 'Username or Email'
              placeholderTextColor = 'rgba(255,255,255,0.7)'
              returnKeyType = 'next'
              keyBoardType = 'email-address'
              autoCapitalize = 'none'
              onChangeText={email => this.setState({ email })}
              value={this.state.email}/>
            </View>
            <Loader loading = {this.state.loading}/>
            <View style = {{flexDirection : 'row',justifyContent: 'space-around',alignSelf : 'flex-start',marginRight : '8%',marginLeft : '3%'}}>
              <Icon name="lock"
                size={22}
                color='black'
                style = {{marginLeft : '10%',marginRight : '3.5%',marginBottom : '1%',alignSelf : 'center'}}/>
              <TextInput style = {styles.input}
                  placeholder = 'Password'
                  secureTextEntry = {true}
                  returnKeyType = 'go'
                  placeholderTextColor = 'rgba(255,255,255,0.7)'
                  maxLength = {20}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
            />
            </View>
            <Loader loading = {this.state.loading}/>
            <Text style = {styles.textstyle}
                  onPress={() => this.props.navigation.navigate('FPassword')}>
                                Forgot Your Password?
            </Text>
            <View style = {{flexDirection : 'row',justifyContent : 'flex-start',marginLeft : '20%',marginTop : '4%'}}>
              <TouchableOpacity style = {styles.buttonContainer1}
                                onPress={this.handleLogin}>
                    <Text style = {styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style = {{flexDirection : 'row',justifyContent : 'flex-start',marginLeft : '20%',marginTop : '1%'}}>
            <TouchableOpacity style = {styles.buttonContainer1}
                              onPress={this.fromState}>
                  <Text style = {styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            </View>
            <Text style = {{marginTop : '5%',alignSelf : 'center',fontSize : 18,color : 'white'}}>Or</Text>
            <View style = {{flexDirection : 'row',justifyContent : 'flex-start',marginLeft : '20%',marginTop : '4%'}}>
              <GoogleSigninButton
                style = {styles.buttonContainer1}
                size = {GoogleSigninButton.Size.Wide}
                color = {GoogleSigninButton.Color.Dark}
                //disabled = {this.state.isSigninInProgress}
                onPress = {this.googleLogin} />
            </View>
            <View style = {{flexDirection : 'row',justifyContent : 'flex-start',marginLeft : '22%',marginTop : '4%'}}>
            <LoginButton
              //publishPermissions = {[“publish_actions”]}
              style = {{height : 35,width : '78%',textAlign : 'center',padding : 15, borderRadius : 0}}
              onPress = {this.facebookLogin}
            />
            </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : '#4682B4',
    flexDirection : 'column',
    justifyContent : 'flex-start',
    //alignItems : 'center',
  },
  childcontainer1 : {
    //flex : 2,
    alignItems : 'center',
    justifyContent : 'center',
    //paddingTop: 0,
  },
  childcontainer2 : {
    //flex : 1,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'space-evenly',
    marginTop : 150,
  },
  childcontainer3 : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'flex-start',
    justifyContent : 'space-evenly'
  },
  input : {
    height : 40,
    width : '70%',
    backgroundColor : 'rgba(250,250,250,0)',
    marginBottom : 20,
    paddingHorizontal : 5,
    paddingBottom : 5,
    borderBottomWidth : 0.75,
    borderColor : 'black',
    color : 'white',
    alignSelf : 'center',
    fontSize : 15,
  },
  buttonContainer1 : {
    backgroundColor : Colors.primaryAppColor,
    paddingVertical : 15,
    height : 55,
    width : '80%',
  },
  buttonText : {
    textAlign : 'center',
    backgroundColor : Colors.buttonTextColor,
    paddingVertical : 15,
    fontWeight : '700'
  },
  buttonAlign : {
    flex : 2,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'space-between',
  },
  textstyle : {
    color : Colors.white,
    //paddingVertical : 10,
    alignSelf : 'center'
  },
});
