import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const UserUpdateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.UserUPdateTitle}>회원 정보 수정하기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  UserUPdateTitle: {
    color: 'black',
    fontSize: 24,
    marginHorizontal: 100,
    marginTop: 60,
  }
});

export default UserUpdateScreen;
