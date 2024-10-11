import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MoreResultItem = () => {
  return (
    <View style={styles.container}>
      <Text>MoreResultItem</Text>
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

export default MoreResultItem;
