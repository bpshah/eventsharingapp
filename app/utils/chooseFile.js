import ImagePicker from 'react-native-image-picker';
export const chooseFile = () => {
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
        return "";
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return "";
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("Before SetState.");
        //JSON.stringify(source.path);
        console.log("Source : " + source.path);
        //let path = `"${source.path}"`
        //console.log("Path : " + path);
        /*this.setState({
          filePath : source.path,
        });*/
        //console.log("In uploadImage: " + this.state.filePath);
        return source.path;
      }
    });

};
