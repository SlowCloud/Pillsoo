import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {authNavigations} from '../../constants/navigations';
import axios from 'axios';
type SignUpScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

type Gender = 'Male' | 'Female';

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError(null);

    const genderValue = gender === 'Male' ? 0 : 1;

    try {
      const response = await axios.post('http://10.0.2.2:8080/api/v1/signup', {
        userId: userId,
        password: password,
        name: userName,
        age: age,
        gender: genderValue,
      });
      if (response.status === 200) {
        Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다.');
        navigation.navigate(authNavigations.LOGIN);
        console.log(response);
      }
    } catch (error) {
      Alert.alert('회원가입 실패');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
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
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <TextInput
        ref={confirmPasswordRef}
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => userNameRef.current?.focus()}
      />
      <TextInput
        ref={userNameRef}
        style={styles.input}
        placeholder="닉네임"
        value={userName}
        onChangeText={setUserName}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => ageRef.current?.focus()}
      />
      <TextInput
        ref={ageRef}
        style={styles.input}
        placeholder="나이"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        returnKeyType="done"
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>성별</Text>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue: Gender) => setGender(itemValue)}>
          <Picker.Item label="남성" value="Male" />
          <Picker.Item label="여성" value="Female" />
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  pickerContainer: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#a4f87b',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SignUpScreen;
