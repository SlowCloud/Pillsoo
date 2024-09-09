import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const OCRScreen = () => {
  return (
    <View style={styles.container}>
      <Text>OCRScreen</Text>
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

export default OCRScreen;
