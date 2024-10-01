import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import { setResetAlarm } from '../../store/store';
import { useDispatch } from 'react-redux';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';


interface MyAlarmListitemsProps {
  myAlarm: {
      alarmSeq: number;
      time: string;
      supplementName: string;
      supplementSeq: number;
      turnOn?: boolean;
  };
}

const MyAlarmListitems: React.FC<MyAlarmListitemsProps> = ({myAlarm}) => {
  const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const dispatch = useDispatch();
  
  const initialPillName = myAlarm.supplementName.length > 11
  ? myAlarm.supplementName.slice(0, 11) + '...'
  : myAlarm.supplementName;
  

  // 알람 삭제
  const deleteAlarm = async () => {
    const storedToken = await AsyncStorage.getItem('jwt_token');

    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/alarm/${myAlarm.alarmSeq}`,
        {
          headers: {
            access: `${storedToken}`,
          },
        },
      )
      dispatch(setResetAlarm(true))
    } catch(error) {
      console.error(error)
    }
  };
  
  // 알람 수정
  const updateAlarm = async() => {
    setOpenAlarmModal(true);
  };

  const setAlarm = async (alarmDate: Date, supplementSeq: number, alamSeq: number) => {
    const storedToken = await AsyncStorage.getItem('jwt_token');

    const date = new Date(alarmDate);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}.00`;
    if (!alarmDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/alarm/${alamSeq}`,
        {
          time: time, 
        },
        {
          headers: {
            access: `${storedToken}`
          },
        }
      );
      dispatch(setResetAlarm(true))
      Alert.alert(`'알람이 ${alarmDate.toLocaleTimeString()}으로 변경되었습니다.`)
    } catch(error) {
      console.log(error)
    }
  };

  const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    if (event.type === 'set') {
      const currentDate = selected || date;
      setOpenAlarmModal(false)
      const changeUTCTime = new Date(currentDate)
      changeUTCTime.setHours(changeUTCTime.getHours()+9)
      setAlarm(changeUTCTime, myAlarm.supplementSeq, myAlarm.alarmSeq)
    } else if (event.type === 'dismissed') {
      setOpenAlarmModal(false)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.alarmTextContainer}>
        <Text style={styles.pillName}>{initialPillName}</Text>
        <Text style={styles.time}>{myAlarm.time}</Text>
      </View>
      <View style={styles.alarmUpdateBtn}>
        <TouchableOpacity
          onPress={updateAlarm}
          style={styles.alarmUpdateBtnText}
          >
          <Text>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteAlarm}
          style={styles.alarmUpdateBtnText}
        >
          <Text>삭제</Text>
        </TouchableOpacity>
      </View>
      {openAlarmModal && (
        <DateTimePicker 
          value={date}
          mode='time'
          display='clock'
          timeZoneName='Asia/Seoul'
          onChange={onChange}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    height: 85,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  alarmTextContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 20,
  },
  pillName: {
    fontSize: 20,
    marginBottom: 3,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: -4,
  },
  alarmUpdateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 3,
    marginRight: 17,
  },
  alarmUpdateBtnText: {
    marginHorizontal: 3,
  }
});

export default MyAlarmListitems;