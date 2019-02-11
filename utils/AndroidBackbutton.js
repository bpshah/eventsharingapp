import {BackHandler} from 'react-native';

const handleAndroidBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback();
    return true;
  });
};

const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', () => {});
}

export {handleAndroidBackButton, removeAndroidBackButtonHandler};
