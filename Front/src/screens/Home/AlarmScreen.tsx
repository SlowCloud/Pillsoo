import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import PushNotification, { Importance } from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { localNotificationService } from '../../LocalNotificationService';

const AlarmScreen = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<'time' | 'date' | 'datetime'>('time');
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    console.log('나옴!');
    configurePushNotifications();
    registerFCM();

    return () => {
      localNotificationService.unRegister();
    };
  }, [selectedDate]);

  const configurePushNotifications = () => {
    try {
      PushNotification.configure({
        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);
          if (notification.userInteraction) {
            onOpenNotification(notification); // 클릭했을 때만 호출
          }
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });
    } catch (error) {
      console.log('Error in PushNotification.configure', error);
    }

    if (Platform.OS === 'android') {
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
          console.log(created ? 'Channel created successfully' : 'Channel already exists or failed to create');
        },
      );
    }
  };

  const registerFCM = async () => {
    const token = await messaging().getToken();
    console.log('[App] onRegister : token :', token);

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
        console.log('App opened from quit state:', remoteMessage);
        onOpenNotification(remoteMessage);
      }
    });
  };

  const openExactAlarmPermissionSettings = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      Linking.openSettings();
    }
  };

  const showTimePicker = () => {
    setShow(true);
    setMode('time');
  };

  const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    const currentDate = selected || date;
    setShow(false);
    setDate(currentDate);
    setSelectedDate(currentDate);
    console.log('시간 정함!!!', selected);
  
    // 알람 자동 설정
    setAlarm();
  };
  
  const setAlarm = async () => {
    if (!selectedDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return;
    }
  
    // 알람 설정
    PushNotification.localNotificationSchedule({
      message: '알람이 울립니다!',
      date: selectedDate,
      allowWhileIdle: true,
    });
  
    Alert.alert(`알람이 ${selectedDate.toLocaleTimeString()}에 설정되었습니다.`);
  };
  
  const onNotification = (notify: any) => {
    if (notify) {
      console.log('[App] onNotification : notify :', notify);
    } else {
      console.log('[App] onNotification : notify is null or undefined');
    }
  };

  const onOpenNotification = (notify: any) => {
    console.log('[App] onOpenNotification : notify :', notify);
    Alert.alert('Open Notification : notify.body :' + notify.body);
  };

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
        <Button onPress={setAlarm} title="알람 설정" />
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
