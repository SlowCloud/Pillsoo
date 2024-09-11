import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput } from 'react-native-gesture-handler';

export type MoreRecommendParamList = {
  MoreRecommend: undefined;
  MoreRecommendResult: undefined;
}

export type MoreRecommendScreenNavigationProp = StackNavigationProp<
  MoreRecommendParamList,
  'MoreRecommend'
>

export type Props = {
  navigation: MoreRecommendScreenNavigationProp;
};



const MoreRecommendScreen:React.FC<Props> = ({navigation}) => {
  // 유저의 건강 산태를 입력받아서
  // 제출 버튼을 누르면
  //  백엔드로 전송하기
  const [text, setText] = useState<string>('');

  const handleTextChange = (inputText: string) => {
    setText(inputText);
  };

  const clickedSubmitBtn = () => {
    // text를 백엔드로 전송하고
    // 데이터랑 함께?? 어쨌든 데이터가 필요함
    // 더 많은 영양제 추천 받는 페이지로
    console.log(text)
    setText('')
    navigation.navigate('MoreRecommendResult');

  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.moreRecommendText}>현재 당신의 건강 상태를 입력해주세요.</Text>
      <TextInput
        autoFocus
        autoCorrect={false}
        multiline
        returnKeyType='done'
        style={styles.inputBox}
        onChangeText={handleTextChange}
        onSubmitEditing={clickedSubmitBtn}
      ></TextInput>
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={clickedSubmitBtn}
      >
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
  }
});

export default MoreRecommendScreen;
