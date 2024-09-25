import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import DetailReviewInput from './DetailReviewInput';
import DetailReviewItems from './DetailReviewItems';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';
import {RouteProp, useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

interface Review {
  reviewSeq: number;
  content: string;
  supplementSeq: number;
  userName: string;
  userSeq: number;
}

const DetailReview: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const {id} = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${API_URL}/api/v1/supplement/${id}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 200) {
          setReviewList(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [id, token, reviewList]);

  return (
    <View style={styles.container}>
      <View style={styles.reviewContents}>
        {reviewList.map(reviewItem => (
          <DetailReviewItems
            key={reviewItem.reviewSeq}
            userName={reviewItem.userName}
            userSeq={reviewItem.userSeq}
            content={reviewItem.content}
            supplementId={reviewItem.supplementSeq}
            reviewId={reviewItem.reviewSeq}
          />
        ))}
        <DetailReviewInput />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewContents: {
    height: '75%',
    width: '90%',
    marginTop: 25,
    marginLeft: 15,
  },
});

export default DetailReview;
