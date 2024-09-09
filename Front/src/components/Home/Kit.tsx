import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator'; // AppStackParamList 가져오기

type KitNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

const Kit = () => {
  const navigation = useNavigation<KitNavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        title="복용 영양제 추가하기"
        onPress={() =>
          navigation.navigate('Home', {
            screen: 'SupplementInput',
          })
        }
      />
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

export default Kit;
