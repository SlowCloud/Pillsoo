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
      <Text style={styles.headerText}>복용하시는 영양제를 관리해보세요 💊</Text>
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
    backgroundColor: 'white',
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
  },
  headerText: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    bottom: 100,
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
