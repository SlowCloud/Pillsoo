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
      alert: Date;
      pillName: string;
      supplementSeq: number;
      turnOn?: boolean;
  };
}

const MyAlarmListitems: React.FC<MyAlarmListitemsProps> = ({myAlarm}) => {
  const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const dispatch = useDispatch();
  const changeUTCTime = new Date(myAlarm.alert)
  changeUTCTime.setHours(changeUTCTime.getHours()+9)
  const LocalTime = changeUTCTime.toLocaleTimeString()

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

  const setAlarm = async (alarmDate: Date, alertDate: Date, supplementSeq: number, alamSeq: number) => {
    const storedToken = await AsyncStorage.getItem('jwt_token');
    if (!alarmDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/alarm/${alamSeq}`,
        {
          alert: alarmDate, 
        },
        {
          headers: {
            access: `${storedToken}`
          },
        }
      );
      dispatch(setResetAlarm(true))
      Alert.alert(`'알람이 ${alertDate.toLocaleTimeString()}으로 변경되었습니다.`)
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
      setAlarm(currentDate, changeUTCTime, myAlarm.supplementSeq, myAlarm.alarmSeq)
    } else if (event.type === 'dismissed') {
      setOpenAlarmModal(false)
    }
  };

  return (
    <View>
      <Text>{myAlarm.pillName}</Text>
      <Text>{LocalTime}</Text>
      <TouchableOpacity
        onPress={deleteAlarm}
      >
        <Text>삭제</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={updateAlarm}
      >
        <Text>수정</Text>
      </TouchableOpacity>
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

const styles = StyleSheet.create({});

export default MyAlarmListitems;