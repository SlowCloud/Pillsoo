import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {authNavigations} from '../../constants/navigations';

type SignUpScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

type Gender = 'Male' | 'Female';

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError(null);
    console.log({username, password, confirmPassword, age, gender});
    navigation.navigate(authNavigations.LOGIN);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
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
