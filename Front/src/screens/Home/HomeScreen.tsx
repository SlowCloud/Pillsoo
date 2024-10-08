import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import MyKit from '../../components/Home/MyKit';
import FastImage from 'react-native-fast-image';

const HomeScreen = () => {
  const navigation = useNavigation();
  const nickname = useSelector(
    (state: {nickname: string | null}) => state.nickname,
  );
  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>{nickname}님</Text>
          <Text style={styles.greeting}>안녕하세요 !</Text>
        </View>
        <View style={styles.circle1}>
          <View style={styles.circle2}>
            <View style={styles.circle3}>
              <View style={styles.circle4}>
            {/* <Image 
              source={require('../../assets/heart3D1.png')}
              style={styles.iconImage}
            ></Image> */}
            <FastImage
              source={require('../../assets/homePill.gif')}
              style={styles.iconImage}
            ></FastImage>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.kit}>
        <View style={styles.myMenuIconsContainer}>
          <Image 
            source={require('../../assets/pillMain2.png')}
            style={styles.myMenuIcon}
            ></Image>
          <Image 
            source={require('../../assets/pillMain3.png')}
            style={styles.myMenuIcon}
            ></Image>
          <Image 
            source={require('../../assets/pillMain4.png')}
            style={styles.myMenuIcon}
            ></Image>
          <Image 
            source={require('../../assets/pillMain5.png')}
            style={styles.myMenuIcon}
            ></Image>
          <Image 
            source={require('../../assets/pillMain1.png')}
            style={styles.myMenuIcon}
          ></Image>
        </View>
        <View style={styles.myMenuContainer}>
          <TouchableNativeFeedback
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'SupplementInput',
              })
            }>
            <View style={styles.myMenuBtn}>
              <Image
                source={require('../../assets/homePill.png')}
                style={styles.myMenuImage}
              />
              <Text style={styles.myMenuText}>영양제 관리</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'Alarm',
              })
            }>
            <View style={styles.myMenuBtn}>
              <Image
                source={require('../../assets/homeAlarm.png')}
                style={styles.myMenuImage}
              />
              <Text style={styles.myMenuText}>알람 관리</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={styles.kitNicknameContainer}>
          <Text style={styles.kitNickname}>
            💊 {nickname}님이 현재 복용 중인 영양제입니다.
          </Text>
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
    backgroundColor: '#87ef70'
    // backgroundColor: '#fff'
  },
  mainTitle: {
    fontFamily: 'WavvePADO-Regular.ttf',
    fontSize: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 30,
    // backgroundColor: '#4dc235',
    backgroundColor: '#87ef70',
    paddingTop: 50,
  },
  nicknameContainer: {
    flexDirection: 'column',
    // alignItems: 'center',
  },
  nickname: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    zIndex: 2,
  },
  greeting: {
    fontSize: 30,
    color: '#557C56',
    fontWeight: '500',
    zIndex:2
  },
  circle1: {
    width: 325,
    height: 325,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 150,
    borderColor: '#FFF4B5',
    bottom: 110,
    left: -30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle2: {
    width: 265,
    height: 265,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 150,
    borderColor: '#FFF4B5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle3: {
    width: 190,
    height: 190,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 150,
    borderColor: '#FFF4B5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle4: {
    width: 102,
    height: 102,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 150,
    borderColor: '#FFF4B5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconImage: {
    width: 165,
    height: 165,
    bottom: 26,
    left: 3
  },
  kit: {
    flex: 4.5,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopStartRadius: 55,
    borderTopEndRadius: 55
  },
  kitNicknameContainer: {
    marginTop: -85,
    marginBottom: -5,
    marginLeft: -60,
  },
  kitNickname: {
    fontSize: 18,
    color: 'black',
    marginLeft : 35,
  },
  myMenuContainer: {
    flexDirection: 'row',
    top: -10,
  },
  myMenuIconsContainer: {
    flexDirection: 'row'
  },
  myMenuIcon: {
    width: 25,
    // height: 25,
    resizeMode: 'contain',
    marginHorizontal: 10
  },
  myMenuBtn: {
    width: '40%',
    height: '60%',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 25,
    backgroundColor: '#fff',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  myMenuImage: {
    width: '37%',
    height: '65%',
    resizeMode: 'contain',
    bottom: 10,
  },
  myMenuText: {
    color: 'black',
    fontSize: 18,
  },
});

export default HomeScreen;
