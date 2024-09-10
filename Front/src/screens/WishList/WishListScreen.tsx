import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../../components/common/Header';
const NotificationsScreen = () => {
  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text>WishList Screen</Text>
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

export default NotificationsScreen;
