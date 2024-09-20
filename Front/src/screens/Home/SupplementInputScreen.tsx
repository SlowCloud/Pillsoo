import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SupplementInputScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.container}>
        <Text>복용하고 있는 리스트</Text>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'OCR',
            })
          }>
          <Text style={styles.scanText}>스캔해서 입력하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  scanText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupplementInputScreen;
