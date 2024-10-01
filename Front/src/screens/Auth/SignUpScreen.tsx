import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {authNavigations} from '../../constants/navigations';
import axios from 'axios';
import {API_URL} from '@env';
type SignUpScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

type Gender = 'Male' | 'Female';

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const [step, setStep] = useState<number>(1); // 현재 단계
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => {
    if (step === 1 && !userId) {
      setError('아이디를 입력해주세요.');
      return;
    } else if (
      step === 2 &&
      (password.length < 8 || password !== confirmPassword)
    ) {
      setError(
        '비밀번호는 8자 이상이어야 하며, 확인 비밀번호와 일치해야 합니다.',
      );
      return;
    } else if (step === 3 && !userName) {
      setError('닉네임을 입력해주세요.');
      return;
    } else if (step === 4 && !age) {
      setError('나이를 입력해주세요.');
      return;
    }

    setError(null);
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAgeInput = (input: string) => {
    // 숫자가 아닐 때
    if (isNaN(Number(input))) {
      Alert.alert('숫자를 입력해주세요');
      setAge(input);

      return;
    }

    // 범위 확인
    const ageNumber = Number(input);
    if (ageNumber < 0 || ageNumber > 99) {
      Alert.alert('0~99세 사이의 나이를 입력하세요.');
    }

    setAge(input);
  };

  const handleSignUp = async () => {
    const genderValue = gender === 'Male' ? 0 : 1;

    try {
      const response = await axios.post(`${API_URL}/api/v1/signup`, {
        userId,
        password,
        nickname: userName,
        age,
        gender: genderValue,
      });
      if (response.status === 200) {
        Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다.');
        navigation.navigate(authNavigations.LOGIN);
      }
    } catch (error) {
      Alert.alert('회원가입 실패', '다시 시도해주세요.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePreviousStep}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.form}>
          {step === 1 && (
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>아이디를 입력해주세요</Text>
              <TextInput
                style={styles.input}
                placeholder="아이디"
                value={userId}
                onChangeText={setUserId}
              />
            </View>
          )}
          {step === 2 && (
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>비밀번호를 입력해주세요</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}
          {step === 3 && (
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>
                가입을 축하드려요 ! {'\n'}어떻게 불러드리면 될까요 ?
              </Text>
              <TextInput
                style={styles.input}
                placeholder="이름"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
          )}
          {step === 4 && (
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>나이를 입력해주세요</Text>
              <TextInput
                style={styles.input}
                placeholder="나이"
                keyboardType="numeric"
                value={age}
                onChangeText={handleAgeInput}
              />
            </View>
          )}
          {step === 5 && (
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>성별을 선택해주세요</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'Male' && styles.selectedGender,
                  ]}
                  onPress={() => setGender('Male')}>
                  <Image
                    source={require('../../assets/001.png')}
                    style={styles.genderImage}
                  />
                  <Text style={styles.genderText}>남성</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'Female' && styles.selectedGender,
                  ]}
                  onPress={() => setGender('Female')}>
                  <Image
                    source={require('../../assets/002.png')}
                    style={styles.genderImage}
                  />
                  <Text style={styles.genderText}>여성</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={step < 5 ? handleNextStep : handleSignUp}>
          <Text style={styles.buttonText}>
            {step < 5 ? '다음' : '회원가입 완료'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  genderOption: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  selectedGender: {
    borderColor: '#a4f87b',
  },
  genderImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  genderText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  button: {
    width: '90%',
    padding: 15,
    backgroundColor: '#a4f87b',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: 'black',
  },
});

export default SignUpScreen;
