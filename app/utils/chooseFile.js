import ImagePicker from 'react-native-image-picker';

class choseFile {

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
  ImagePicker.showImagePicker(response => {
     console.log('Response = ', response);
     if (response.didCancel) {
       console.log('User cancelled image picker');
       return response;
     } else if (response.error) {
       console.log('ImagePicker Error: ', response.error);
       return response;
     } else {
       //let source = response;
       //You can also display the image using data:
       //let source = { uri: 'data:image/jpeg;base64,' + response.data };
       //console.log("Before SetState.");
       //console.log("Path : " + path);
       /*this.setState({
          filePath : source.path,
        });*/
       //console.log("In uploadImage: " + this.state.filePath);
        return response.path;
      }
    });
  };
};

const cfile = new choseFile();
export default cfile;
