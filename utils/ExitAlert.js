import {Alert, BackAndroid} from 'react-native';

const exitAlert = () => {
  Alert.alert(
    'Confirm exit',
    'Do you want to quit the app?'
    [
      {text: 'CANCEL', style: 'cancel'},
      {text: 'OK', onPress: () => BackAndroid.exitApp()}
    ]
  );
};

export {exitAlert};
