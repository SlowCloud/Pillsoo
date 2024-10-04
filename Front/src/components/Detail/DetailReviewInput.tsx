import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';
import {API_URL} from '@env';
type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

const DetailReviewInput: React.FC = () => {
  const [review, setReview] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const route = useRoute<DetailScreenRouteProp>();
  const {id} = route.params;

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleTextChange = (inputText: string) => {
    setReview(inputText);
  };

  const clickedSubmitBtn = async () => {
    console.log('hihi')
    if (!token) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/supplement/${id}/reviews`,
        // `http://10.0.2.2:8080/api/v1/supplement/${id}/reviews`,
        {content: review},
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      if (response.status === 200) {
        setReview('');
        console.log(response)
      } else {
        Alert.alert('리뷰 작성 실패');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
      // <KeyboardAwareScrollView>
    <View style={styles.container}>
        <TextInput
          autoCorrect={false}
          multiline
          style={styles.inputBox}
          value={review}
          onChangeText={handleTextChange}
        />
      <TouchableOpacity style={styles.inputBtn} onPress={clickedSubmitBtn}>
        <Text style={styles.inputBtnText}>입력</Text>
      </TouchableOpacity>
    </View>
      // </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    // position: 'absolute',
    // bottom: 30,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  inputBox: {
    height: '90%',
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  inputBtnText: {
    color: 'white',
  },
  inputBtn: {
    width: '20%',
    height: '30%',
    borderRadius: 5,
    backgroundColor: '#0B2F9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '76%',
    bottom: -10,
  },
});

export default DetailReviewInput;
