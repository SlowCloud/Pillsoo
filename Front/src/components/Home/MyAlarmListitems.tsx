import React from 'react';
import {StyleSheet, View, Text} from 'react-native';


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
    console.log('아이템', myAlarm)
  return (
    <View>
        <Text>{myAlarm.pillName}</Text>
        <Text>{myAlarm.alert.toString()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({});

export default MyAlarmListitems;