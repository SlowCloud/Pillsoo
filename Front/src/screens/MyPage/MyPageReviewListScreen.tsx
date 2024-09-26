import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import MyPageReviewItems from '../../components/MyPage/MyPageReviewItems';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';

interface Review {
  reviewSeq: number;
  userSeq: number;
  supplementSeq: number;
  userNickname: string;
  content: string;
  createdAt: string;
}

const MyPageReviewListScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [myAllReviews, setMyAllReviews] = useState<Review[]>([]);
  const userSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );
  // 프론트가 백한테 유저id 보낸다
  // 백이 프론트한테 유저 정보, 리뷰를 쓴 영양제의 id를 보낸다
  // 프론트가 백한테 영양제 id를 보낸다
  // 백이 프론트한테 영양제 상세 정보를 보낸다
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  // 보충제 데이터 들고오기 (상세 데이터)
  useEffect(() => {
    const fetchMyReview = async () => {
      if (!token) {
        console.log('리뷰 가지고 오고 싶은데 토큰이 없어');
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/v1/reviews`, {
          headers: {
            access: `${token}`,
          },
          params: {
            userSeq: userSeq,
          },
        });
        setMyAllReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyReview();
  }, [token]);

  const renderMyReview = ({item}: {item: Review}) => (
    <MyPageReviewItems
      key={item.reviewSeq}
      content={item.content}
      userNickname={item.userNickname}
      supplementSeq={item.supplementSeq}
      token={token}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.myReviewTitle}>내가 작성한 리뷰</Text>
      <FlatList
        data={myAllReviews}
        renderItem={renderMyReview}
        keyExtractor={item => item.content}
        contentContainerStyle={styles.myReviewBox}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myReviewTitle: {
    color: 'black',
    fontSize: 24,
    marginHorizontal: 100,
    marginTop: 60,
  },
  myReviewBox: {
    marginVertical: 20,
  },
});

export default MyPageReviewListScreen;
