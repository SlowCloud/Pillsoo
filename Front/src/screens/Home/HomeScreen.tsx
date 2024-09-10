import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Kit from '../../components/Home/Kit';
import Header from '../../components/common/Header';
const HomeScreen = () => {
  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={{fontSize: 25}}>현우님 안녕하세요 !</Text>
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
});

export default HomeScreen;
