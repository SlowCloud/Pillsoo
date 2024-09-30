import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
  const myName = useSelector((state: {userId: string | null}) => state.userId);

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
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>📣 {nickName}</Text>
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

      {myName === userName && !updateContent && (
        <View>
          <TouchableOpacity onPress={() => setUpdateContent(true)}>
            <Text>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  reviewContent: {
    color: 'black',
    fontSize: 15,
    marginTop: 1,
  },
});

export default DetailReviewItems;
