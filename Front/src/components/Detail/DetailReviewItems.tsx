import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-gesture-handler';
import {API_URL} from '@env';

type Props = {
  userName: string;
  content: string;
  supplementId: number;
  userSeq: number;
  reviewId: number;
  nickName: string;
};

const DetailReviewItems: React.FC<Props> = ({
  userName,
  content,
  supplementId,
  userSeq,
  reviewId,
  nickName,
}) => {
  const storedUserSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );

  const [token, setToken] = useState<string | null>(null);
  const [updateContent, setUpdateContent] = useState<boolean>(false);
  const [updateReview, setUpdateReview] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleUpdateTextChange = (inputText: string) => {
    setUpdateReview(inputText);
  };

  const clickedUpdateBtn = async () => {
    setUpdateContent(false);
    setUpdateReview('');
    if (!token) return;

    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/supplement/${supplementId}/reviews`,
        {reviewSeq: reviewId, content: updateReview},
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      Alert.alert('리뷰 수정 성공', '리뷰가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.log(error);
      Alert.alert('리뷰 수정 실패', '리뷰 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/supplement/${supplementId}/reviews`,
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      Alert.alert('리뷰 삭제 성공', '리뷰가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.log(error);
      Alert.alert('리뷰 삭제 실패', '리뷰 삭제에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewNickname}>📣 {nickName}</Text>
        {storedUserSeq === userSeq && !updateContent && (
          <View style={styles.optionContianer}>
            <TouchableOpacity onPress={() => setUpdateContent(true)}>
              <Text>수정</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity onPress={handleDelete}>
              <Text>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {updateContent ? (
        <View>
          <TextInput
            value={updateReview}
            placeholder={content}
            autoCorrect={false}
            multiline
            onChangeText={handleUpdateTextChange}
          />
          <TouchableOpacity onPress={clickedUpdateBtn}>
            <Text>수정 완료</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.reviewContent}>{content}</Text>
      )}

      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  reviewContainer: {
    flexDirection: 'row',
  },
  reviewNickname: {
    color: 'black',
  },
  reviewContent: {
    color: 'black',
    fontSize: 15,
    marginTop: 1,
    marginLeft: 20,
  },
  line: {
    width: '100%',
    height: 0.45,
    backgroundColor: '#DFDFDE',
    marginTop: 10,
  },
  optionContianer: {
    flexDirection: 'row',
    marginLeft: 7,
  },
});

export default DetailReviewItems;
