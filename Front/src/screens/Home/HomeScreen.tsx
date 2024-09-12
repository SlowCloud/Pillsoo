import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Kit from '../../components/Home/Kit';
import Header from '../../components/common/Header';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={{fontSize: 25}}>현우님 안녕하세요 !</Text>
      </View>

      <View style={styles.kit}>
        <Kit />
      </View>

      <View style={styles.alarm}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Alarm',
            })
          }>
          <Image
            source={require('../../assets/Alarm.png')}
            style={styles.alarmImage}
          />
          {/* <Text>알람설정</Text> */}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    alignItems: 'flex-start',
    padding: 30,
  },
  kit: {
    flex: 1,
    alignItems: 'center',
  },
  alarm: {
    flex: 0.25,
    alignItems: 'flex-end',
    bottom: 50,
  },

  alarmImage: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;
