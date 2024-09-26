import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Kit from '../../components/Home/Kit';
import Header from '../../components/common/Header';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const HomeScreen = () => {
  const navigation = useNavigation();
  const nickname = useSelector((state: {nickname: string | null}) => state.nickname);
  const decodedNickname = nickname ? decodeURIComponent(nickname) : '닉네임이 없습니다';
  console.log("Redux에서 가져온 닉네임:", decodedNickname);

  return (
    <LinearGradient
      colors={['#ffffff', '#a4f870', '#ffffff']}
      style={styles.screenContainer}>
      <Header />
      <View style={styles.container}>
        <Text style={{fontSize: 25}}>{nickname}님 안녕하세요 !</Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 0.1,
    alignItems: 'flex-start',
    padding: 30,
  },
  kit: {
    flex: 1.5,
    alignItems: 'center',
  },
  alarm: {
    flex: 0.25,
    alignItems: 'flex-end',
    justifyContent: 'center',
    bottom: 20,
  },
  alarmImage: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;
