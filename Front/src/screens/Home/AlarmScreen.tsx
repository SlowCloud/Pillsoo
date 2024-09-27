import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  Modal
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import PushNotification, { Importance } from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';

interface Alarm {
  id: string;
  message: string;
  date: Date;
}

interface Supplement {
  supplementSeq: number;
  pillName: string;
  functionality: string;
  imageUrl: string;
}

const AlarmScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [myKitData, setMyKitData] = useState<Supplement[]>([]);

  const userSeq = useSelector((state: {userSeq: number | null}) => state.userSeq,
  );

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
    // 채널이랑 연결
    configurePushNotifications();
    // 디바이스 토큰 가지고 옴
    registerFCM();
    // 앱이 메시지 받을 수 있어?
    requestNotificationPermission();

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
    // 토큰을 가지고 온다
    const token = await messaging().getToken();
    setToken(token);
    console.log('[App] onRegister: token :', token);

    // messaging().onMessage(async remoteMessage => {
    //   console.log('A new FCM message arrived!', remoteMessage);
    //   // onNotification(remoteMessage);
    // });

    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log('Notification caused app to open from background state:', remoteMessage);
    //   onOpenNotification(remoteMessage);
    // });

    // messaging().getInitialNotification().then(remoteMessage => {
    //   if (remoteMessage) {
    //     console.log('App opend from quit state:', remoteMessage);
    //     onOpenNotification(remoteMessage);
    //   }
    // });
  };

  // const handleFCM = async (alarmDate, message) => {
  //   const alarmFCMData = {
  //     token: myFCMToken,
  //     message: message,
  //     alarmTime: alarmDate
  //   };

    // 백엔드한테 alarmFCMData 보내기
  // }

  // 시간 설정하는 모달? 쨌든 뭐 연다
  const showTimePicker = () => {
    setShow(true);
  };

  // 알람 정보를 저장한다
  const setAlarm = async (alarmDate: Date) => {
    if (!alarmDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return ;
    }
    const message = '영양제 먹을 시간입니다.'
    Alert.alert(`알람이 ${alarmDate.toLocaleTimeString()}에 설정되었습니다`);
  };

  // 시간을 설정한다
  const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    const currentDate = selected || date;
    if (event.type === 'set') {
      setDate(currentDate);
      setSelectedDate(currentDate);
      setAlarm(currentDate)
    }
    setShow(false);
  };



  // 어떤 알람이 오는지 alert에 표시
  // 필요없음 확인만
  const onOpenNotification = (notify: any) => {
    console.log('[App] onOpenNotification : notify :', notify);
    Alert.alert('Open Notification : nofify.body :'+ notify.body);
  }

  // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    setOpenModal((prev) => !prev);
    if (openModal === false)  {
      fetchMyKitData();
    };
  }

  const fetchMyKitData = async () => {
    const token = await AsyncStorage.getItem('jwt_token');

    try {
      const response = await axios.get(`${API_URL}/api/v1/cabinet`, {
        headers: {
          access: `${token}`,
        },
        params: {
          userSeq,
        },
      });

      setMyKitData(response.data);
      console.log('나 마이키트 데이터 가져옴')
    } catch (err) {
      console.error(err);
    }
  };


  // 알람 설정 모달
  const settingAlarm = 
    <Modal>
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={styles.modalBoxHeader}>
            <TouchableOpacity onPress={showAlarmModal}>
              <Text style={styles.modalBoxHeaderText}>X</Text>
            </TouchableOpacity>
          </View>
          {/* 마이키트 목록 올거임 */}
          </View>
    </View>
      </Modal>



  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={showAlarmModal}
          style={styles.alarmAddBtn}
          >
        <Text style={styles.alarmText}>+</Text>
        {show && (
          <DateTimePicker
            value={date}
            mode="time"
            display="clock"
            onChange={onChange}
          />
        )}
        </TouchableOpacity>
      </View>
      {openModal ? settingAlarm : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 30,
    marginRight: 30,
  },
  alarmText: {
    fontSize: 30,
  },
  alarmAddBtn: {
    backgroundColor: '#4379F2',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox : {
    height: '85%',
    width: '95%',
    borderRadius: 25,
    borderWidth: 1,
  },
  modalBoxHeader: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginTop: 20,
    marginLeft: 330,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBoxHeaderText: {
    fontWeight: 'bold',
    fontSize: 22,
  }
});

export default AlarmScreen;
