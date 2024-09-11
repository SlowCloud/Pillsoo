import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Kit from '../../components/Home/Kit';
import Header from '../../components/common/Header';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={{fontSize: 25}}>현우님 안녕하세요 !</Text>
      </View>
      <View style={styles.alarm}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Alarm',
            })
          }>
          <Text>알람 설정 !</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.kit}>
        <Kit />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    alignItems: 'flex-start',
    padding: 20,
  },

  kit: {
    flex: 1,
    alignItems: 'center',
  },
  alarm: {
    flex: 0.2,
    alignItems: 'flex-end',
    paddingRight: 30,
  },
});

export default HomeScreen;
