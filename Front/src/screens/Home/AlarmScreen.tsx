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
          console.error('Error Data:', error.response?.data);
          console.error('Error status', error.response?.status);
        } else {
          console.error('Error message:', (error as Error).message);
        }
      }
    };

    fetchPillData();
  }, [token]);

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

  const showAlarmModal = () => {
    dispatch(setOpenModal(true));
  };

  return (
    <View style={styles.container}>
      {openModal && <AlarmModal myKitData={myKitData} />}
      {/* <View style={styles.alarmTitleContainer}>
        <Text style={styles.alarmTitle}>알람</Text>
      </View> */}
      <View style={styles.alarmContainer}>
        {myAlarms.length > 0 ? (
          <ScrollView>
            {myAlarms.map(alarm => (
              <MyAlarmListitems key={alarm.alarmSeq} myAlarm={alarm} />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noAlarmText}>알람설정한 영양제가 없습니다.</Text>
        )}
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
    flex: 1,
    justifyContent: 'center', // 세로 정렬을 가운데로 설정
    alignItems: 'center', // 가로 정렬을 가운데로 설정
    marginHorizontal: 25,
  },
  buttonContainer: {
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
  noAlarmText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default AlarmScreen;
