/*import ProfilePage from 'C:/Users/DELL/Documents/EventSharingSystem/Screens/ProfilePage.js';
import firebase from 'react-native-firebase';

export const handleUpdate = () => {

  let user = firebase.auth().currentUser;
  const email = user.email;
  const updateProfile = {
    firstname : ProfilePage.firstname,
    lastName : ProfilePage.lastName,
    date : ProfilePage.date,
    mobileNumber : ProfilePage.mobileNumber,
    gender : ProfilePage.gender,
    location : ProfilePage.location,
  }
  console.log("Before Update");
  const temail = email.slice(0,user.email.indexOf('@'));
  //let updates['Users/' + temail] = updateProfile;
  console.log(updateProfile + " " +temail);
  firebase.database().ref('Users/' + temail).updates(firstname,lastName,date,mobileNumber,gender,location).then(navigation.navigate('Events'));
  console.log("Updated");
};*/
