//const functions = require('firebase-functions');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendNotiFication =  functions.database.ref('Events')
  .onCreate( (snapshot,context) => {

      let events = snapshot.val();
      console.log("Payload : " + events);
      let payload = {
        notifiaction : {
          title : 'Event',
          body : `${events.eventname}`
        }
      }
      return admin.messaging().send(payload).then( (resposne) => {
                return console.log("notifications sent successfully :  " + response);
              }).catch((error) => {
                console.log(error);
              })
  });
