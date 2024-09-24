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
import { API_URL } from '@env';
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
    if (!token) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/supplement/${id}/reviews`,
        // `http://10.0.2.2:8080/api/v1/supplement/${id}/reviews`,
        {content: review},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        setReview('');
      } else {
        Alert.alert('리뷰 작성 실패');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.inputBtn} onPress={clickedSubmitBtn}>
        <Text style={styles.inputBtnText}>입력</Text>
      </TouchableOpacity>
      <KeyboardAwareScrollView>
        <TextInput
          autoCorrect={false}
          multiline
          style={styles.inputBox}
          value={review}
          onChangeText={handleTextChange}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    height: 100,
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
    // height: 40,
    borderRadius: 5,
    backgroundColor: '#0B2F9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '76%',
    marginBottom: 20,
  },
});

export default DetailReviewInput;
