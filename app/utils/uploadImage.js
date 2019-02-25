import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';

export const uploadImage = (uri,imageName, mime = 'image/png') => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    return new Promise((resolve, reject) => {
        //const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const uploadUri = uri;
        let uploadBlob = null;
        const imageRef = firebase.storage().ref('images').child(imageName);
        fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(uri, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          //console.log("After ref");
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          //console.log("In Ui :" + this.state.imgsrc);
          resolve(url)
          return url;
        })
        .catch((error) => {
          reject(error)
        });

    })
  }
