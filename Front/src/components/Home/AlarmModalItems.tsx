import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { setResetAlarm } from '../../store/store';
import { useDispatch } from 'react-redux';
import CommonModal from '../common/Modal';

interface AlarmModalItemsProps {
    pillName: string;
    supplementSeq: number;
    imageUrl: string;
}

const AlarmModalItems: React.FC<AlarmModalItemsProps> = ({ pillName, supplementSeq, imageUrl}) => {
  const dispatch = useDispatch();
  const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageImageUrl, setMessageImageUrl] = useState<any>(require('../../assets/warning.png'));
  const [date, setDate] = useState<Date>(new Date());
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, [])

  // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    setOpenAlarmModal(true);
  };

  // 알람 정보를 저장한다
  const setAlarm = async (alarmDate: Date, supplementSeq: number) => {
    const date = new Date(alarmDate);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    const time = `${hours}:${minutes}:${seconds}.00`;
    console.log(time);
    if (!alarmDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return ;
    }

    // 백한테 보내자
    try {
      const response = await axios.post(`${API_URL}/api/v1/alarm`, 
      {
        supplementSeq: supplementSeq, 
        time: time,
        isTurnOn: true
      },
      {
        headers: {
          access: `${token}`,
        },
      });
      dispatch(setResetAlarm(true));
      setVisible(true);
      setMessage(`알람이 ${alarmDate.toLocaleTimeString()}으로 만들어졌습니다.`)
      setMessageImageUrl(require('../../assets/alarmadd.png'))
    } catch(error) {
      if (axios.isAxiosError(error)) {
      // 서버가 응답했는데 요청 실패
      console.error('Error Data:', error.response?.data);
      console.error('Error status', error.response?.status);
    } else {
      // 요청이 이루어지지 않았거나 오류 발생
      console.error('Error message:', (error as Error).message)
    }}
  };

  // 시간을 설정한다
  const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    if (event.type === 'set') {
      const currentDate = selected || date;
      setOpenAlarmModal(false)
      const changeUTCTime = new Date(currentDate);
      changeUTCTime.setHours(changeUTCTime.getHours()+9)
      setAlarm(changeUTCTime, supplementSeq)
    } else if (event.type === 'dismissed') {
      setOpenAlarmModal(false)
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{uri: imageUrl}} 
        style={styles.itemImage}
        />
      <View>
        <View style={styles.pillNameContainer}>
          <Text style={styles.pillName}>{pillName}</Text>
        </View>
        <TouchableOpacity
          onPress={showAlarmModal}
        >
          <View style={styles.alarmAddContainer}>
            <Text style={styles.alarmAddText}>알람 추가</Text>
          </View>
        </TouchableOpacity>
      </View>
      {openAlarmModal && (
        <DateTimePicker
          value={date}
          mode="time"
          display="clock"
          timeZoneName='Asia/Seoul'
          onChange={onChange}
        />
      )}
      {visible && (
        <CommonModal 
          visible={visible} 
          message={message} 
          onClose={() => setVisible(false)}
          imageSource={messageImageUrl}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 230,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  itemImage: {
    width: 135,
    height: 135,
    marginRight: 15,
  },
  pillNameContainer: {
    height: 63,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pillName: {
    color: 'black'
  },
  alarmAddContainer: {
    width: 160,
    height: 40,
    backgroundColor: '#a4f87b',
    alignItems: 'center',
  },
  alarmAddText: {
    color: 'black',
    marginTop: 8,
  }
});


export default AlarmModalItems;