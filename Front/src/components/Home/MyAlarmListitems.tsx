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
  onAlarmListDeleted: () => Promise<void>;
}

const MyAlarmListitems: React.FC<MyAlarmListitemsProps> = ({myAlarm, onAlarmListDeleted}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>(
    require('../../assets/warning.png'),
  );
  const [date, setDate] = useState<Date>(new Date());
  const [checkAlarmOn, setCheckAlarmOn] = useState<boolean>(true);
  const dispatch = useDispatch();

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
      setMessage(`알람이 삭제되었습니다.`);
      setImageUrl(require('../../assets/alarmremove.png'));
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCloseModal = () => {
    setVisible(false);
    onAlarmListDeleted();
  }

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
    const time = `${hours}:${minutes}:00.00`;
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

  const changeAlarmOnOff = async (
    alarmDate: Date,
    alarmSeq: number,
  ) => {
    setCheckAlarmOn(prev => {
      const newCheckAlarmOn = !prev;

      getChangeAlarmOnOff(alarmDate, alarmSeq, newCheckAlarmOn);
      return newCheckAlarmOn;
    });
  }

  const getChangeAlarmOnOff = async (
    alarmDate: Date,
    alamSeq: number,
    isTurnOn: boolean
  ) => {
    const storedToken = await AsyncStorage.getItem('jwt_token');
    const date = new Date(alarmDate);
    const timeString = date.toISOString().substr(11, 8);
    const alarmTime = timeString + '.00'
    console.log('알람 onoff 도전', alarmTime, alamSeq, isTurnOn)
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/alarm/${alamSeq}`,
        {
          time: alarmTime,
          isTurnOn: isTurnOn
        },
        {
          headers: {
            access: `${storedToken}`,
          },
        },
      )
      console.log('했따')
    } catch(error) {
      console.log(error)
    }
  }

  const convertTimeStringToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(); // 현재 날짜를 가져옵니다.
    date.setHours(hours, minutes, 0, 0); // 시간을 설정합니다.
    return date;
  }

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
      <View style={styles.BtnContainer}>
        <TouchableOpacity
          onPress={() => changeAlarmOnOff(convertTimeStringToDate(myAlarm.time), myAlarm.alarmSeq)}
        >
          <View style={styles.alarmOnOffBtn}>
            <View 
              style={[
                styles.alarmOnOffSmallBtn,  
                checkAlarmOn ? styles.alarmOnOffSmallBtnRed : styles.alarmOnOffSmallBtnGreen]}>
              <View 
                style={[
                  styles.alarmOnOffClickBtn,
                  !checkAlarmOn && styles.alarmOnOffClickBtnRight
                  ]}></View>
            </View>
          </View>
          </TouchableOpacity>
          <View style={styles.alarmUpdateBtn}>
            <TouchableOpacity
              onPress={updateAlarm}
              style={styles.alarmUpdateBtnText}
              >
              <Text>수정</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity
              onPress={deleteAlarm}
              style={styles.alarmUpdateBtnText}
            >
              <Text>삭제</Text>
            </TouchableOpacity>
          </View>
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
          onClose={handleCloseModal}
          imageSource={imageUrl}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 365,
    height: 90,
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
    fontSize: 32,
    marginBottom: -4,
  },
  alarmUpdateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    top: 10,
    marginRight: 17,
  },
  BtnContainer: {
    flexDirection: 'row'
  },
  alarmUpdateBtnText: {
    marginHorizontal: 3,
  },
  alarmOnOffBtn: {
    width: 55,
    height: 25,
    backgroundColor: '#F6F5F2',
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 20,
    top: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  alarmOnOffSmallBtn: {
    width: 45,
    height: 15,
    borderRadius: 20,
  },
  alarmOnOffSmallBtnRed: {
    backgroundColor: '#C40C0C',
  },
  alarmOnOffSmallBtnGreen: {
    backgroundColor: '#00712D'
  },
  alarmOnOffClickBtn: {
    width: 20,
    height: 20,
    backgroundColor: '#E5E1DA',
    borderRadius: 10,
    bottom: 3
  },

  alarmOnOffClickBtnRight: {
    left: 25
  }
});

export default MyAlarmListitems;
