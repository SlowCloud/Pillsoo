import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {RouteProp, useRoute} from '@react-navigation/native';
import {API_URL} from '@env';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';

type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

interface DetailReviewInputProps {
  onReviewSubmit: () => void;
}

const DetailReviewInput: React.FC<DetailReviewInputProps> = ({ onReviewSubmit }) => {
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
  }, [token]);

  const handleTextChange = (inputText: string) => {
    setReview(inputText);
  };

  const clickedSubmitBtn = async () => {
    if (!token) {
      Alert.alert('토큰이 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/supplement/${id}/reviews`,
        {content: review},
        {
          headers: {
            access: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('리뷰가 성공적으로 제출되었습니다!');
        setReview('');
        onReviewSubmit();
      } else {
        Alert.alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      Alert.alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1}}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="리뷰를 입력하세요..."
          value={review}
          onChangeText={handleTextChange}
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={clickedSubmitBtn}>
          <Text style={styles.submitButtonText}>제출</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#00FF00',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default DetailReviewInput;
