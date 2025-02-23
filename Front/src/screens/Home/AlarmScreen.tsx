import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {API_URL} from '@env';
import AlarmModal from '../../components/Home/AlarmModal';
import {setOpenModal} from '../../store/store';
import {setResetAlarm} from '../../store/store';
import MyAlarmListitems from '../../components/Home/MyAlarmListitems';

interface Supplement {
  supplementSeq: number;
  pillName: string;
  functionality: string;
  imageUrl: string;
}

interface AlarmList {
  alarmSeq: number;
  time: string;
  supplementName: string;
  supplementSeq: number;
  turnon: boolean;
}

const AlarmScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [myKitData, setMyKitData] = useState<Supplement[]>([]);
  const [myAlarms, setMyAlarms] = useState<AlarmList[]>([]);

  const dispatch = useDispatch();
  const openModal = useSelector(
    (state: {openModal: boolean | null}) => state.openModal,
  );
  const resetAlarm = useSelector(
    (state: {resetAlarm: boolean | null}) => state.resetAlarm,
  );

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
    dispatch(setOpenModal(false));
  }, []);

  useEffect(() => {
    const fetchPillData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/v1/cabinet`, {
          headers: {
            access: `${token}`,
          },
        });

        setMyKitData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // 서버가 응답했는데 요청 실패
          console.error('Error Data:', error.response?.data);
          console.error('Error status', error.response?.status);
        } else {
          // 요청이 이루어지지 않았거나 오류 발생
          console.error('Error message:', (error as Error).message);
        }
      }
    };

    fetchPillData();
  }, [token]);

  // 알람 목록 가지고 와
  useEffect(() => {
    const fetchAlarmData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/v1/alarm`, {
          headers: {
            access: `${token}`,
          },
        });
        setMyAlarms(response.data);
        dispatch(setResetAlarm(false));
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlarmData();
  }, [token, resetAlarm]);

  // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    dispatch(setOpenModal(true));
  };

  return (
    <View style={styles.container}>
      {openModal && <AlarmModal myKitData={myKitData} />}
      <View style={styles.alarmTitleContainer}>
        <Text style={styles.alarmTitle}>알람</Text>
      </View>
      <View style={styles.alarmContainer}>
        <ScrollView>
          {myAlarms &&
            myAlarms.map(alarm => (
              <MyAlarmListitems key={alarm.alarmSeq} myAlarm={alarm} />
            ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={showAlarmModal} style={styles.alarmAddBtn}>
          <Text style={styles.alarmAddText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  alarmContainer: {
    marginHorizontal: 25,
    marginVertical: 35,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 30,
    marginRight: 30,
  },
  alarmTitleContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  alarmTitle: {
    fontWeight: 'bold',
    fontSize: 27,
    color: 'black',
  },
  alarmAddText: {
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
