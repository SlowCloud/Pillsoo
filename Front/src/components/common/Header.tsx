import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View>
      <Text style={styles.container}>Logo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
  },
});

export default Header;
