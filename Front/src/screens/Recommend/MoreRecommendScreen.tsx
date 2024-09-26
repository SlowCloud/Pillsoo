import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TextInput} from 'react-native-gesture-handler';

export type MoreRecommendParamList = {
  MoreRecommend: undefined;
  MoreRecommendResult: {inputText: string};
};

export type MoreRecommendScreenNavigationProp = StackNavigationProp<
  MoreRecommendParamList,
  'MoreRecommend'
>;

export type Props = {
  navigation: MoreRecommendScreenNavigationProp;
};

const MoreRecommendScreen: React.FC<Props> = ({navigation}) => {
  const [text, setText] = useState<string>('');

  const handleTextChange = (inputText: string) => {
    setText(inputText);
  };

  const clickedSubmitBtn = () => {
    navigation.navigate('MoreRecommendResult', {inputText: text});
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moreRecommendText}>
        현재 당신의 건강 상태를 입력해주세요.
      </Text>
      <TextInput
        autoFocus
        autoCorrect={false}
        multiline
        returnKeyType="done"
        style={styles.inputBox}
        onChangeText={handleTextChange}
        onSubmitEditing={clickedSubmitBtn}></TextInput>
      <TouchableOpacity style={styles.submitBtn} onPress={clickedSubmitBtn}>
        <Text style={styles.submitBtnText}>제출</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  moreRecommendText: {
    fontSize: 17,
    marginLeft: 5,
    color: 'black',
  },
  inputBox: {
    height: '60%',
    marginTop: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#D3EBCD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    height: 35,
    borderRadius: 5,
  },
  submitBtnText: {
    color: 'black',
  },
});

export default MoreRecommendScreen;
