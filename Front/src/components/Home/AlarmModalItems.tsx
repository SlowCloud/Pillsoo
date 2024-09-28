import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

interface AlarmModalItemsProps {
    functionality: string;
    pillName: string;
    supplementSeq: number;
    imageUrl: string;
}

const AlarmModalItems: React.FC<AlarmModalItemsProps> = ({ functionality, pillName, supplementSeq, imageUrl}) => {
    const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
    const [token, setToken] = useState<string | null>(null);
    const [currentSupplementSeq, setCurrentSupplementSeq] = useState<number | null>(null);

    useEffect(() => {
        setCurrentSupplementSeq(supplementSeq);
    }, [supplementSeq]);

    useEffect(() => {
      const fetchToken = async () => {
        const storedToken = await AsyncStorage.getItem('jwt_token');
        setToken(storedToken);
      };
  
      fetchToken();
    }, [supplementSeq]);

    // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    setOpenAlarmModal(true);
  };

  // 알람 정보를 저장한다
  const setAlarm = async (alarmDate: Date, supplementSeq: number) => {
    if (!alarmDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return ;
    }
    // 백한테 보내자
    const alarmTime = new Date(alarmDate);
    console.log('alarmTime', alarmTime)
    try {
      const response = await axios.post(`${API_URL}/api/v1/alarm`, 
      {
        supplementSeq: supplementSeq, 
        alert: alarmTime,
        isTurnOn: true
      },
        {
        headers: {
          access: `${token}`,
        },
      });

    Alert.alert(`알람이 ${alarmDate.toLocaleTimeString()}에 설정되었습니다`);
  } catch(error) {
    console.error(error);
  }
}

    // 시간을 설정한다
    const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
        console.log('Event type:', event.type);
        console.log('나 왔다')
        const currentDate = selected || date;
        console.log(currentDate)
        console.log(currentSupplementSeq)
        if (event.type === 'set') {
            setDate(currentDate);
            if (currentSupplementSeq != null) {
              console.log('나 알람 보낼 시간이랑 영양제임', currentDate, currentSupplementSeq)
                setAlarm(currentDate, currentSupplementSeq);
            }
        }
        console.log('나 했디')
        setOpenAlarmModal(false);
      };

  return (
    <View>
        <Image source={{uri: imageUrl}} />
        <Text>{pillName}</Text>
        <TouchableOpacity
            onPress={showAlarmModal}
        >
            <Text>알람 추가</Text>
        </TouchableOpacity>
        {openAlarmModal && (
          <DateTimePicker
            value={date}
            mode="time"
            display="clock"
            onChange={onChange}
          />
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 15,
      },
});

export default AlarmModalItems;