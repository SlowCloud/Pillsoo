import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchResultItem from '../../components/Search/SeachResultItem';

const SearchResultScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SearchResultScreen</Text>
      <SearchResultItem />
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

export default SearchResultScreen;
