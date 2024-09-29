import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import AlarmModal from '../../components/Home/AlarmModal';
import { setOpenModal } from '../../store/store';
import { setResetAlarm } from '../../store/store';
import MyAlarmListitems from '../../components/Home/MyAlarmListitems';

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
  const [myKitData, setMyKitData] = useState<Supplement[]>([]);
  const [myAlarms, setMyAlarms] = useState<AlarmList[]>([]);
  const dispatch = useDispatch();
  const openModal = useSelector((state: {openModal: boolean | null}) => state.openModal);
  const userSeq = useSelector((state: {userSeq: boolean | null}) => state.userSeq);
  const resetAlarm = useSelector((state: {resetAlarm: boolean | null}) => state.resetAlarm);

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
      console.log('내 복용 영양제 정보 받아옴')
      } catch (error) {
        console.error(error);
      }
    };
    fetchPillData();
  }, [token]);

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
        dispatch(setResetAlarm(false))
        setMyAlarms(response.data)
        console.log('내 알람 정보 받아옴')
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlarmData();
  }, [token, resetAlarm])

  // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    dispatch(setOpenModal(true));
  };

  return (
    <View style={styles.container}>
      {openModal && <AlarmModal myKitData={myKitData}/>}
      <ScrollView>
        {myAlarms && myAlarms.map((alarm) => (
            <MyAlarmListitems key={alarm.alarmSeq} myAlarm={alarm}/>
          ))
        }
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={showAlarmModal}
          style={styles.alarmAddBtn}
          >
        <Text style={styles.alarmText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
