import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MyPageReviewListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>MyPageReviewListScreen</Text>
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

export default MyPageReviewListScreen;
