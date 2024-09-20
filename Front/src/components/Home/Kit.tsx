import React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';

type KitNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

const Kit = () => {
  const navigation = useNavigation<KitNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        onPress={() =>
          navigation.navigate('Home', {
            screen: 'SupplementInput',
          })
        }>
        <View style={styles.button}>
          <Text style={styles.buttonText}>복용 영양제 목록 보기</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#a4f870',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Kit;
