import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const GenderRecommned = () => {
  return (
    <View style={styles.container}>
      <Text>GenderRecommned</Text>
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

export default GenderRecommned;
