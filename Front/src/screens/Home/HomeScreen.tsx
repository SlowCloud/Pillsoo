import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Kit from '../../components/Home/Kit';
import Header from '../../components/common/Header';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import SearchBar from '../../components/common/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  const navigation = useNavigation();
  const nickname = useSelector(
    (state: {nickname: string | null}) => state.nickname,
  );
  return (
    <>
      <View style={styles.container}>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>{nickname}님</Text>
          <Text style={styles.greeting}>안녕하세요 !</Text>
        </View>
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
        </TouchableOpacity>
      </View>

      <View style={styles.kit}>
        <Kit />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  mainTitle: {
    fontFamily: 'WavvePADO-Regular.ttf',
    fontSize: 30,
  },
  container: {
    flex: 0.1,
    alignItems: 'flex-start',
    padding: 30,
    backgroundColor: '#a4f87b',
    paddingTop: 50,
  },
  nicknameContainer: {
    flexDirection: 'column',
    // alignItems: 'center',
  },
  nickname: {
    fontSize: 25,
    color: 'white',
  },
  greeting: {
    fontSize: 25,
    color: 'black',
  },
  kit: {
    flex: 1.5,
    alignItems: 'center',
    backgroundColor: '#a4f87b',
  },
  alarm: {
    flex: 0.25,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#a4f87b',
  },
  alarmImage: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;
