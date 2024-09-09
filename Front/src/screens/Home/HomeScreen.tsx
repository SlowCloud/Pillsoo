import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Kit from '../../components/Home/Kit';

const HomeScreen = () => {
  return (
    <>
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
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
  },

  kit: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default HomeScreen;
