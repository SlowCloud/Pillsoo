import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MoreRecommendScreen = () => {
  return (
    <View style={styles.container}>
      <Text>MoreRecommendScreen</Text>
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

export default MoreRecommendScreen;
