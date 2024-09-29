import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import { setResetAlarm } from '../../store/store';
import { useSelector, useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const deleteAlarm = async () => {
    const storedToken = await AsyncStorage.getItem('jwt_token');

    try {
      console.log('시도한다')
      const response = await axios.delete(
        `${API_URL}/api/v1/alarm/${myAlarm.alarmSeq}`,
        {
          headers: {
            access: `${storedToken}`,
          },
        },
      )
      console.log('성공했다')
      dispatch(setResetAlarm(true))
    } catch(error) {
      console.error(error)
    }
  }
  return (
    <View>
        <Text>{myAlarm.pillName}</Text>
        <Text>{myAlarm.alert.toString()}</Text>
        <TouchableOpacity
          onPress={deleteAlarm}
        >
          <Text>삭제</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({});

export default MyAlarmListitems;