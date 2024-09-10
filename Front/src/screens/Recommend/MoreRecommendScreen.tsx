import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const MoreRecommendScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.moreRecommendText}>현재 당신의 건강 상태를 입력해주세요.</Text>
      <TextInput style={styles.inputBox}></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 20,
  },
  moreRecommendText: {
    fontSize: 17,
  },
  inputBox: {
    height: '60%',
    marginTop: 10,
    marginRight: 20,
    backgroundColor: '#fff'
  }
});

export default MoreRecommendScreen;
