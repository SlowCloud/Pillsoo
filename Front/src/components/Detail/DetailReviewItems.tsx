import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
// import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-gesture-handler';
import {API_URL} from '@env';
type Props = {
  userName: string;
  content: string;
  supplementId: number;
  userId: number;
  reviewId: number;
};

const DetailReviewItems: React.FC<Props> = ({
  userName,
  content,
  supplementId,
  userId,
  reviewId,
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
        // `http://10.0.2.2:8080/api/v1/supplement/${supplementId}/reviews`,
        {reviewSeq: reviewId, content: updateReview},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const UPdateMyReview = (
    <View>
      <TextInput
        value={updateReview}
        placeholder={content}
        autoCorrect={false}
        multiline
        onChangeText={handleUpdateTextChange}></TextInput>
      <TouchableOpacity onPress={clickedUpdateBtn}>
        <Text>수정 완료</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDelete = async () => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/supplement/${supplementId}/reviews`,
        // `http://10.0.2.2:8080/api/v1/supplement/${supplementId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateAndDelete = (
    <View>
      <TouchableOpacity onPress={() => setUpdateContent(true)}>
        <Text>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <Text>삭제</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text>📣{userName}</Text>
      {updateContent ? (
        UPdateMyReview
      ) : (
        <Text style={styles.reviewContent}>{content}</Text>
      )}
      {myName == userName ? updateAndDelete : null}
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
