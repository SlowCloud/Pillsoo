import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Text>SearchBar</Text>
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

export default SearchBar;
