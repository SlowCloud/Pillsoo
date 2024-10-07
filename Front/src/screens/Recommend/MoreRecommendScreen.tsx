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
      <View style={styles.moreRecommentContainer}>
        <Text style={styles.moreRecommendText}>
        현재 당신의 건강 상태를 입력해주세요.
        </Text>
        <TextInput
        value={text}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  moreRecommentContainer: {
    marginTop: 50,
    marginHorizontal: 7,
  },
  moreRecommendText: {
    fontSize: 17,
    marginLeft: 6,
    color: 'black',
  },
  inputBox: {
    height: '60%',
    marginTop: 15,
    marginHorizontal: 5,
    backgroundColor: '#F8F8F8',
    padding: 10,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#a4f87b',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
    height: 45,
    borderRadius: 5,
  },
  submitBtnText: {
    color: '#fff',
  },
});

export default MoreRecommendScreen;
