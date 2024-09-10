import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../../components/common/Header';
const MyPageScreen = () => {
  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text>MyPageScreen</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPageScreen;
