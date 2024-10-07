import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {setResetAlarm} from '../../store/store';
import {useDispatch} from 'react-redux';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import CommonModal from '../../components/common/Modal';

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
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>(
    require('../../assets/warning.png'),
  );
  const [date, setDate] = useState<Date>(new Date());
  const [timer, setTimer] = useState<number>(2);
  const [interValId, setInterValId] = useState<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (interValId) {
        clearInterval(interValId);
      }
    };
  }, [interValId]);

  useEffect(() => {
    if (visible) {
      setMessage(
        `알람이 삭제되었습니다.\n이 창은 ${timer}초 후에 자동으로 닫힙니다.`,
      );
    }
  }, [timer, visible]);

  const initialPillName =
    myAlarm.supplementName.length > 11
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
      );
      setVisible(true);
      setMessage(
        `알람이 삭제되었습니다.\n이 창은 ${timer}초 후에 자동으로 닫힙니다.`,
      );
      setImageUrl(require('../../assets/alarmremove.png'));

      // 타이머 시작
      const id = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) {
            clearInterval(id);
            dispatch(setResetAlarm(true));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setInterValId(id);
    } catch (error) {
      console.error(error);
    }
  };

  // 알람 수정
  const updateAlarm = async () => {
    setOpenAlarmModal(true);
  };

  const setAlarm = async (
    alarmDate: Date,
    supplementSeq: number,
    alamSeq: number,
  ) => {
    const storedToken = await AsyncStorage.getItem('jwt_token');

    const date = new Date(alarmDate);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    // 초를 제거하고 시간 포맷 수정
    const time = `${hours}:${minutes}.00`;
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
            access: `${storedToken}`,
          },
        },
      );
      dispatch(setResetAlarm(true));
      setVisible(true);
      setMessage(
        `알람이 ${alarmDate
          .toLocaleTimeString()
          .split(':')
          .slice(0, 2)
          .join(':')}으로 변경되었습니다.`,
      );
      setImageUrl(require('../../assets/alarmupdate.png'));
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    if (event.type === 'set') {
      const currentDate = selected || date;
      setOpenAlarmModal(false);
      const changeUTCTime = new Date(currentDate);
      changeUTCTime.setHours(changeUTCTime.getHours() + 9);
      setAlarm(changeUTCTime, myAlarm.supplementSeq, myAlarm.alarmSeq);
    } else if (event.type === 'dismissed') {
      setOpenAlarmModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.alarmTextContainer}>
        <Text style={styles.time}>
          {myAlarm.time.split(':').slice(0, 2).join(':')}
        </Text>
        <Text style={styles.pillName}>{initialPillName}</Text>
      </View>
      <View style={styles.alarmUpdateBtn}>
        <TouchableOpacity
          onPress={updateAlarm}
          style={styles.alarmUpdateBtnText}>
          <Text>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteAlarm}
          style={styles.alarmUpdateBtnText}>
          <Text>삭제</Text>
        </TouchableOpacity>
      </View>
      {openAlarmModal && (
        <DateTimePicker
          value={date}
          mode="time"
          display="clock"
          timeZoneName="Asia/Seoul"
          onChange={onChange}
        />
      )}
      {visible && (
        <CommonModal
          visible={visible}
          message={message}
          onClose={() => setVisible(false)}
          imageSource={imageUrl}
        />
      )}
      <View style={styles.alarmOnBtn}>
      </View>
    </View>
  );
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
    gap: 10,
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
  },
  alarmOnBtn: {
    width: 65,
    height: 25,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 20
  }
});

export default MyAlarmListitems;
