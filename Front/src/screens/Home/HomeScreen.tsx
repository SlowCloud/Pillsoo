import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TouchableNativeFeedback} from 'react-native';
import Kit from '../../components/Home/Kit';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import MyKit from '../../components/Home/MyKit';

const HomeScreen = () => {
  const navigation = useNavigation();
  const nickname = useSelector((state: {nickname: string | null}) => state.nickname,);
  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>{nickname}님</Text>
          <Text style={styles.greeting}>안녕하세요 !</Text>
        </View>
      </View>
      <View style={styles.kit}>
        <View style={styles.myMenuContainer}>
        <TouchableNativeFeedback
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'SupplementInput',
            })
          }
        >
          <View style={styles.myMenuBtn}>
            <Image
              source={require('../../assets/homePill.png')}
              style={styles.myMenuImage}
            />
            <Text style={styles.myMenuText}>내 영양제</Text>
            <Text style={styles.myMenuText}>관리하러 가기</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Alarm',
            })
          }
        >
          <View style={styles.myMenuBtn}>
            <Image
              source={require('../../assets/homeAlarm.png')}
              style={styles.myMenuImage}
            />
            <Text style={styles.myMenuText}>내 알람</Text>
            <Text style={styles.myMenuText}>관리하러 가기</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={styles.kitNicknameContainer}>
        <Text style={styles.kitNickname}>💊{nickname}님이 현재 복용 중인 영양제입니다.</Text>
      </View>
        {/* <Kit /> */}
        <MyKit />
      </View>
    </View>
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
    flex: 1,
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
    fontSize: 30,
    color: 'white',
  },
  greeting: {
    fontSize: 25,
    color: 'black',
  },
  kit: {
    flex: 4.5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  kitNicknameContainer: {
    marginTop: -85,
    marginBottom: -5,
    marginLeft: -100,
  },
  kitNickname: {
    fontSize: 15,
    color: 'black'
  },
  myMenuContainer: {
    flexDirection: 'row'
  },
  myMenuBtn: {
    width: '40%',
    height: '60%',
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 25,
  },
  myMenuImage: {
    width: '40%',
    height: '65%',
    resizeMode: 'contain',
    bottom: 10,
  },
  myMenuText: {
    color: 'black',
    fontSize: 16,
  },
});

export default HomeScreen;
