import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const UserUpdateScreen = () => {
  return (
    <View style={styles.container}>
      <Text>UserUpdateScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserUpdateScreen;
