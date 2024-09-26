import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import PushNotification, { Importance } from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlarmScreen = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<'time' | 'date' | 'datetime'>('time');
  const [show, setShow] = useState<boolean>(false);
  const [selectedDate, showSelectedDate] = useState<Date | null>(null);

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

  // 알람 스크린이 렌더링되면 firebase랑 채널 연결
  useEffect(() => {
    configurePushNotifications();
    registerFCM();
    requestNotificationPermission();
    // 앱을 시작할 때 저장된 알람 로드
    loadAlarms();

    return () => {
      console.log('cleaning up...');
    };
  }, []);


  // 채널이랑 연결
  const configurePushNotifications = () => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('notifiation', notification)
        if (notification.userInteraction) {
          onOpenNotification(notification);
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
        (created) => {
          console.log(created ? 'Channel created successfully' : 'Channel already exist or failed to create');
        }
      );
    }
  };

  // firebase 서버에서 수신받음
  const registerFCM = async () => {
    const token = await messaging().getToken();
    console.log('[App] onRegister: token :', token);

    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      onNotification(remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      onOpenNotification(remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opend from quit state:', remoteMessage);
        onOpenNotification(remoteMessage);
      }
    });
  };

  // 알람을 로컬로 보냄
  const onNotification = (notify: any) => {
    if (notify) {
      console.log('[App] onNotification : notify : ', notify);
      if (notify.notification) {
        const { title, body } = notify.notification;
        console.log('title:', title, 'body:', body);
        PushNotification.localNotification({
          channelId: 'default_my_channel_id',
          title: title,
          message: body
        });
      }
    } else {
      console.log('[App] onNotification: notify is null or undefined');
    }
  };

  // 어떤 알람이 오는지 alert에 표시
  const onOpenNotification = (notify: any) => {
    
  }




  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 설정</Text>

      <View style={styles.timeContainer}>
        <Text style={styles.alarmText}>
          {selectedDate ? `설정된 알람 시간: ${selectedDate.toLocaleTimeString()}` : '알람 시간이 설정되지 않았습니다.'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={showTimePicker} title="알람 시간 선택" />
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            display="default"
            onChange={onChange}
          />
        )}
        <Button 
          // onPress={setAlarm} 
          title="알람 설정" 
          disabled={!selectedDate} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  timeContainer: {
    marginBottom: 20,
  },
  alarmText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
});

export default AlarmScreen;
