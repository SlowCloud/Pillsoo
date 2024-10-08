/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import store from './src/store/store';
import { Provider } from 'react-redux';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message Handled in the background!', remoteMessage);
});

function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
        return null;
    }

    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
