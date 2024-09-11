import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const DetailReviewInput = () => {
  // 리뷰를 백엔드로 전송
  const [review, setReview] = useState<string>('');

  const handleTextChange = (inputText: string) => {
    setReview(inputText);
  };

  const clickedSubmitBtn = () => {
      setReview('')
      // 백엔드로 리뷰 보내라
  }
  return (
    <View>
      <KeyboardAwareScrollView>
        <TextInput
          autoCorrect={false}
          multiline
          style={styles.inputBox}
          value={review}
          onChangeText={handleTextChange}
        />
      </KeyboardAwareScrollView>
      <TouchableOpacity
        style={styles.inputBtn}
        onPress={clickedSubmitBtn}
      >
        <Text style={styles.inputBtnText}>입력</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    height: '100%',
    width: '95%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginLeft: '2%',
  },
  inputBtnText: {
    color: 'white',
  },
  inputBtn: {
    width: '20%',
    height: '6%',
    borderRadius: 5,
    backgroundColor: '#0B2F9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '76%',
    marginBottom: '80%'
  }
});

export default DetailReviewInput;
