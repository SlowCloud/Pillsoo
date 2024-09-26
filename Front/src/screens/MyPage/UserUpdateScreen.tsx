import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {setNickname} from '../../store/store';

const UserUpdateScreen = () => {
  const dispatch = useDispatch();
  const [newNickname, setNewNickname] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmnewPassword, setConfirmNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  const nickname = useSelector((state: {nickname: string}) => state.nickname);
  const age = useSelector((state: {age: number | null}) => state.age);
  const gender = useSelector((state: {gender: string | null}) => state.gender);
  console.log('회원정보 수정에서 내 젇보!!!!!!!!', nickname, age, gender);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleUPdate = async () => {
    if (!token) return;

    if (newPassword && newPassword != confirmnewPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다');
      return;
    }

    try {
      const updateData: any = {
        nickname: newNickname || nickname,
        age: age,
        gender: gender,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }
      console.log('나 회원정보 바꿀거임', updateData);
      const response = await axios.patch(
        `${API_URL}/api/v1/update`,
        updateData,
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      Alert.alert('회원정보 수정을 완료했습니다');
      if (newNickname) {
        dispatch(setNickname(newNickname));
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            // value={newPassword}
            onChangeText={setNewPassword}
            placeholder="비밀번호 변경"
            style={styles.userupdateInput}
          />
          <Text>{error}</Text>
        </View>
        <View style={styles.userUpdateInputBox}>
          <Text style={styles.userUpdateInputTitle}>비밀번호 확인</Text>
          <TextInput
            secureTextEntry
            // value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            placeholder="비밀번호 변경 확인"
            style={styles.userupdateInput}></TextInput>
        </View>
        <View style={styles.userUpdateBtnBox}>
          <TouchableOpacity onPress={handleUPdate} style={styles.userUpdateBtn}>
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
  userUpdateBox: {
    marginHorizontal: 15,
    marginVertical: 55,
  },
  userUpdateInputBox: {
    marginBottom: 20,
  },
  userUpdateInputTitle: {
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
    alignItems: 'center',
  },
  userUpdateBtnText: {
    color: 'black',
  },
});

export default UserUpdateScreen;
