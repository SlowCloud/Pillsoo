import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Kit = () => {
  return (
    <View style={styles.container}>
      <Text>Kit</Text>
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

export default Kit;
