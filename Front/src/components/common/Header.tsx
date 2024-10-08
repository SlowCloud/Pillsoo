import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 20,
    height: 50,
    backgroundColor: '#fff',
  },
  logo: {
    height: 150,
    width: 100,
  },
});

export default Header;
