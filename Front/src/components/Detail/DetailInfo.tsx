import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DetailInfo = () => {
  return (
    <View style={styles.container}>
      <Text>DetailInfo</Text>
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

export default DetailInfo;
