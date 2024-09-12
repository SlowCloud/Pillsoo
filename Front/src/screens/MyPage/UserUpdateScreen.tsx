import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

const UserUpdateScreen = () => {
  const [nickname, setNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // 백엔드에서 유저 정보 가져오기
    setNickname('현우')
    setNewNickname('현우')
  }, [])

  const handleUPdate = () => {
    if (password != confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다');
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userUpdateTitle}>회원 정보 수정하기</Text>
      <View style={styles.userUpdateBox}>
        <View style={styles.userUpdateInputBox}>
          <Text style={styles.userUpdateInputTitle}>닉네임</Text>
          <TextInput
            value={newNickname}
            onChangeText={setNewNickname}
            placeholder={nickname}
            style={styles.userupdateInput}
          />
        </View>
        <View style={styles.userUpdateInputBox}>
          <Text style={styles.userUpdateInputTitle}>비밀번호</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder='비밀번호 변경'
            style={styles.userupdateInput}
          />
        </View>
        <View style={styles.userUpdateInputBox}>
          <Text style={styles.userUpdateInputTitle}>비밀번호 확인</Text>
          <TextInput
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder='비밀번호 변경 확인'
            style={styles.userupdateInput}
          ></TextInput>
        </View>
        <View style={styles.userUpdateBtnBox}>
          <TouchableOpacity 
            onPress={handleUPdate}
            style={styles.userUpdateBtn}
          >
            <Text style={styles.userUpdateBtnText}>변경</Text>
          </TouchableOpacity>
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userUpdateTitle: {
    color: 'black',
    fontSize: 24,
    marginHorizontal: 100,
    marginTop: 60,
  },
  userUpdateBox : {
    marginHorizontal: 15,
    marginVertical: 55,
  },
  userUpdateInputBox : {
    marginBottom: 20,
  },
  userUpdateInputTitle : {
    color: 'black',
    marginLeft: 5,
  },
  userupdateInput: {
    borderRadius: 10,
    marginTop: 5,
  },
  userUpdateBtnBox: {
    alignItems: 'flex-end',
    marginRight: 10,

  },
  userUpdateBtn: {
    width: 60,
    height: 30,
    marginTop: 30,
    // backgroundColor: '#D3EBCD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userUpdateBtnText: {
    color: 'black',
  },
});

export default UserUpdateScreen;
