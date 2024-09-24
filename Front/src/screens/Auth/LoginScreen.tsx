import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {authNavigations} from '../../constants/navigations';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useDispatch} from 'react-redux';
import {setUserId as setReduxUserId} from '../../store/store';
import {setUserSeq} from '../../store/store';
import {setRole} from '../../store/store';
import base64 from 'base-64';

type LoginScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.LOGIN
>;

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/signin`,
        {
          username: userId,
          password,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        const token = response.headers['access'];
        if (token) {
          await AsyncStorage.setItem('jwt_token', token);

          const payload = token.substring(
            token.indexOf('.') + 1,
            token.lastIndexOf('.'),
          );
          const dec = JSON.parse(base64.decode(payload));

          dispatch(setReduxUserId(dec.userId));
          dispatch(setUserSeq(dec.userSeq));
          dispatch(setRole(dec.role));

          navigation.navigate('Main');
          Alert.alert('로그인 성공');
        } else {
          Alert.alert('토큰이 없습니다. 로그인 실패');
        }
      }
    } catch (error) {
      Alert.alert('로그인 실패');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={userId}
        onChangeText={setUserId}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#a4f87b',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LoginScreen;
