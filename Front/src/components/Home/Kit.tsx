import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
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
        <Image
          source={require('../../assets/Pill.png')}
          style={styles.buttonImage}
        />
        {/* <Text style={styles.buttonText}>복용 영양제 목록 보기</Text> */}
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
    // backgroundColor: 'white',
    // borderTopEndRadius: 50,
    // borderTopStartRadius: 50,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonImage: {
    width: 200,
    height: 200,
  },
});

export default Kit;
