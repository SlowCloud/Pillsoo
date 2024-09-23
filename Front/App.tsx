import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { fcmService } from './src/FCMService';
import { localNotificationService } from './src/LocalNotificationService';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';

// FCM으로부터의 알림 데이터 형식 정의
interface NotificationData {
  title: string;
  body: string;
  [key: string]: any;
}

const App: React.FC = () => {
  useEffect(() => {
    // PushNotification 초기화
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // 필요 시 알림 클릭 시 동작 추가
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Notification 채널 생성
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'default_my_channel_id', // 채널 ID
          channelName: 'Default Channel', // 채널 이름
          channelDescription: 'A default channel for notifications', // 채널 설명
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
        },
        (created) => {
          if (created) {
            console.log('Channel created successfully');
          } else {
            console.log('Channel already exists or failed to create');
          }
        },
      );
    }
    // FCM 서비스 등록
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token: string) {
      console.log('[App] onRegister : token :', token);
    }

    function onNotification(notify: NotificationData): void {
      console.log('[App] onNotification : notify :', notify);
      
      const id = '0'; // ID는 문자열로
      const title = notify.title;
      const message = notify.body;

      
      
      const options = {
        channelId: 'default_my_channel_id', // 생성한 채널 ID 사용
        soundName: 'default',
        playSound: true,
      };
      
      
      localNotificationService.showNotification(id, title, message, notify, options);
      console.log('나 여기까지 왔는지 확인', id, title, message, notify, options)
    }

    
    function onOpenNotification(notify: NotificationData) {
      console.log('[App] onOpenNotification : notify :', notify);
      Alert.alert('Open Notification : notify.body :' + notify.body);
    }
    
    return () => {
      console.log('[App] unRegister');
      fcmService.unRegister();
      localNotificationService.unRegister();
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
