import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Platform, PermissionsAndroid } from 'react-native';
import { setFcmToken } from './src/store/store';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import { useSelector, useDispatch } from 'react-redux';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const fcmToken = useSelector((state: {fcmToken: string | null}) => state.fcmToken);


  // 앱에서 알람을 받을 수 있는지 확인
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // 앱에서 알람을 받을 수 있음
            console.log('Notification permission granted')
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    // 채널이랑 연결
    configurePushNotifications();
    // 디바이스 토큰 가지고 옴
    registerFCM();
    // 앱이 메시지 받을 수 있어?
    requestNotificationPermission();
  }, []);


  // 채널이랑 연결
  const configurePushNotifications = () => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('notifiation', notification)
        if (notification.userInteraction) {
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'android',
    });

    if (Platform.OS === 'android') {
      // 채널을 만든다
      // 기존에 있으면 이미 있다고 콘솔에 찎힘
      PushNotification.createChannel(
        {
          channelId: 'default_my_channel_id',
          channelName: 'Default Channel',
          channelDescription: 'A default channel for notifications',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
        },
        (created: boolean, error?: any) => {
          if (error) {
            console.error('Channel creation failed', error)
          } else {
            console.log(created ? 'Channel created successfully' : 'Channel already exist or failed to create');
          }
        }
      );
    }
  };


  // firebase 서버에서 수신받음
  const registerFCM = async () => {
    // 토큰을 가지고 온다
    const token = await messaging().getToken();
    dispatch(setFcmToken(token));
    console.log('[App] onRegister: token :', token);

    // 토큰을 백엔드로 전송하는 함수 만들어라!!!!!!!!!!!!!!!!!!!!

    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);

      PushNotification.localNotification({
        title: remoteMessage.notification?.title || '알림',
        message: remoteMessage.notification?.body || '메시지가 도착했습니다',
        channelId: 'default_my_channel_id'
      })
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opend from quit state:', remoteMessage);
      }
    });
  };


  return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
  );
};

export default App;
