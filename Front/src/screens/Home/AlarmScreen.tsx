import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';

const AlarmScreen = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');

  // 알람 설정 화면으로 이동하는 함수 (Android 12 이상)
  const openExactAlarmPermissionSettings = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      Linking.openSettings(); // 시스템 설정 화면으로 이동
    }
  };

  // 시간 선택이 변경될 때 실행되는 함수
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    setAlarmTime(`${hours}:${minutes < 10 ? `0${minutes}` : minutes}`);
  };

  // 시간 선택 창 열기
  const showTimePicker = () => {
    setShow(true);
    setMode('time');
  };

  // 알람 설정 함수
  const setAlarm = async () => {
    if (!alarmTime) {
      alert('알람 시간을 선택해 주세요.');
      return;
    }

    // 알람 울릴 시간 계산 (현재 시간 이후에 설정)
    const currentTime = new Date();
    const timeToAlarm = new Date(date);

    if (timeToAlarm <= currentTime) {
      alert('현재 시간보다 나중 시간을 선택해 주세요.');
      return;
    }

    // Android 12 이상에서 정확한 알람을 설정하려면 설정 화면으로 이동
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      openExactAlarmPermissionSettings();
    }

    PushNotification.localNotificationSchedule({
      message: '알람이 울립니다!', // 알람에 표시될 메시지
      date: timeToAlarm, // 알람 울릴 시간
      allowWhileIdle: true, // 앱이 비활성 상태일 때도 알람
    });

    alert(`알람이 ${alarmTime}에 설정되었습니다.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 설정</Text>

      <View style={styles.timeContainer}>
        <Text style={styles.alarmText}>
          {alarmTime
            ? `설정된 알람 시간: ${alarmTime}`
            : '알람 시간이 설정되지 않았습니다.'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={showTimePicker} title="알람 시간 선택" />
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <Button onPress={setAlarm} title="알람 설정" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  timeContainer: {
    marginBottom: 20,
  },
  alarmText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
});

export default AlarmScreen;
