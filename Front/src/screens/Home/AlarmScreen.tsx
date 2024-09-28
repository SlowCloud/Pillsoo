import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import AlarmModal from '../../components/Home/AlarmModal';
import { setOpenModal } from '../../store/store';

interface Supplement {
  supplementSeq: number;
  pillName: string;
  functionality: string;
  imageUrl: string;
};

interface AlarmList {
  alarmSeq: number;
  alert: Date;
  pillName: string;
  supplementSeq: number;
  turnon: boolean;
};

const AlarmScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [FCMToken, setFCMToken] = useState<string | null>(null);
  const [myKitData, setMyKitData] = useState<Supplement[]>([]);
  const [myAlarms, setMyAlarms] = useState<AlarmList[]>([]);
  const dispatch = useDispatch();
  const openModal = useSelector((state: {openModal: boolean | null}) => state.openModal);
  const userSeq = useSelector((state: {userSeq: boolean | null}) => state.userSeq);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchPillData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/cabinet`,
          {
            headers: {
              access: `${token}`,
            },
            params: {
              userSeq: userSeq,
            },
          },
        );
      setMyKitData(response.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchPillData();
  }, [token, myKitData]);

  // 알람 목록 가지고 와
  useEffect(() => {
    const fetchAlarmData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/alarm`,
          {
            headers: {
              access: `${token}`,
            },
            params: {
              userSeq: userSeq,
            },
          },
        );
        setMyAlarms(response.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlarmData();
  })

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
  }


  // firebase 서버에서 수신받음
  const registerFCM = async () => {
    // 토큰을 가지고 온다
    const token = await messaging().getToken();
    setFCMToken(token);
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


  // 어떤 알람이 오는지 alert에 표시
  // 필요없음 확인만
  const onOpenNotification = (notify: any) => {
    console.log('[App] onOpenNotification : notify :', notify);
    Alert.alert('Open Notification : nofify.body :'+ notify.body);
  }

  // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    dispatch(setOpenModal(true));
  };


  return (
    <View style={styles.container}>
      {openModal && <AlarmModal myKitData={myKitData}/>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={showAlarmModal}
          style={styles.alarmAddBtn}
          >
        <Text style={styles.alarmText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}

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
});

export default AlarmScreen;
