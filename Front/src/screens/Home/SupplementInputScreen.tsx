import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SupplementInputScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.container}>
        <Text>SupplementInputScreen</Text>
        <Button
          title="스캔해서 입력하기"
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'OCR',
            })
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupplementInputScreen;
