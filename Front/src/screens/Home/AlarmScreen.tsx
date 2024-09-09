import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AlarmScreen = () => {
  return (
    <View style={styles.container}>
      <Text>AlarmScreen</Text>
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

export default AlarmScreen;
