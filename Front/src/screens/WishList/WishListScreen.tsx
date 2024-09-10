import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../../components/common/Header';
import WishListItem from '../../components/WishList/WishListItem';
const WishListScreen = () => {
  return (
    <>
      <Header />
      <View style={styles.container}>
        <WishListItem />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});

export default WishListScreen;
