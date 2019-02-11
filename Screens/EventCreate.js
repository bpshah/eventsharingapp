import React, {Component}  from 'react';
import {PixelRatio,View, ScrollView ,Text, Image, StyleSheet, TextInput, KeyboardAvoidingView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5.js';
import ImagePicker from 'react-native-image-picker';
//import ImageSlider from 'react-native-image-slider';
import { Avatar, CheckBox, ButtonGroup } from 'react-native-elements';

const options = {
  title : 'Add Picture',
  chooseFromLibraryButtonTitle : 'Select from Library',
}

export default class EventCreate extends Component{

  static navigationOptions = ({navigation}) => ({
    headerTitleStyle : {
       textAlign : 'center',
       flex : 1,
       },
    title : 'New Event',
    //swipeEnabled : false,
    //tabBarVisible : false,
    headerRight : (
      <View marginRight = {10}>
        <Icon id = {1} name="check" size={20} color="#900" onPress={() => navigation.navigate('Events')}/>
      </View>

    ),
    headerLeft : (
      <View marginLeft = {10}>
        <Icon name="angle-left" size={30} color="#900" onPress={() => navigation.navigate('Events')}/>
      </View>
    )
  })

  constructor(props){
    super(props);
    this.state= {
      avatarSource : null,
      filePath : {},
    };
  }

  selectPhotoTapped() {
      const options = {
        quality : 1.0,
        maxWidth : 500,
        maxHeight : 500,
        storageOptions : {
          skipBackup : true
        }
      }
    }

    chooseFile = () => {
        var options = {
          title: 'Select Image',
          customButtons: [
            { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
          ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            let source = response;
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              filePath: source,
            });
          }
        });
    };

  render(){

    return(
      <ScrollView contentContainerStyle = {styles.container}
                  scrollEnabled = {true}
                  keyboardDismissMode = 'none'>
          <Avatar
            rectangle
            source = {this.filePath}
            showEditButton
            height = {175}
            width = '80%'
            margin = {30}
            alignSelf = 'center'
            imageProps = {{resizeMode : 'stretch'}}
            editButton = {{size : 40}}
            onEditPress = {this.chooseFile.bind(this)}
          />
          <TextInput style = {styles.input}
                title = 'Event Name'
                placeholder = 'Name of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
          />
          <TextInput style = {styles.input}
                title = 'Time'
                placeholder = 'Time of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}
          />
          <TextInput style = {styles.input}
                title = 'Place'
                placeholder = 'Place of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                autoCapitalize = 'none'
                autoCorrect = {false}
                value={this.state.text}
          />
          <TextInput style = {styles.input}
                title = 'Contact'
                placeholder = 'Contact of Organizer'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                keyBoardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect = {false}

          />
          <TextInput style = {styles.input}
                title = 'Description'
                placeholder = 'Description of Event'
                placeholderTextColor = 'rgba(255,255,255,0.7)'
                returnKeyType = 'next'
                //keyBoardType = 'email-address'
                multiline = {true}
                autoCapitalize = 'none'
                autoCorrect = {false}
                onContentSizeChange={(event) => {
                    this.setState({height: event.nativeEvent.contentSize.height});
                  }}
          />

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

  container : {
    flexGrow : 1,
    backgroundColor : '#E96A69',
    flexDirection : 'column',
    alignItems: 'flex-start',
    justifyContent : 'flex-start',
    height : 575,
    width : '100%'
    //width: 100,
    //height: 100,
  },
  input : {
    height : 40,
    backgroundColor : 'rgba(255,255,255,0.2)',
    marginBottom : 20,
    alignSelf : 'center',
    width : '80%',
    paddingHorizontal : 15,
    paddingVertical : 0,
    color : '#FFF'
  },
  ImageContainer: {
      flex : 45,
      borderColor: '#9B9B9B',
      borderWidth: 1 / PixelRatio.get(),
      //borderRadius : 150/2,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems : 'center',
      backgroundColor: '#FFFFFF',
      marginBottom : 25,
      marginTop : 25,
      width : '80%',
      aspectRatio : 1/1,
    }
  })
