import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DetailReviewInput from './DetailReviewInput';
const DetailReview = () => {
  return (
    <View style={styles.container}>
      <Text>DetailReview</Text>
      <DetailReviewInput />
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

export default DetailReview;
