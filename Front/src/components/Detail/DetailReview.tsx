import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DetailReviewInput from './DetailReviewInput';
import DetailReviewItems from './DetailReviewItems';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';

type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

interface Review {
  reviewSeq: number;
  content: string;
  supplementSeq: number;
  userName: string;
  userSeq: number;
  nickName: string;
}

const DetailReview: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const {id} = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [hasWrittenReview, setHasWrittenReview] = useState<boolean>(false);
  
  const currentUserSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/supplement/${id}/reviews`,
        {
          headers: {
            access: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setReviewList(response.data);
        const userReview = response.data.find(
          (review: Review) => review.userSeq === currentUserSeq
        );
        setHasWrittenReview(!!userReview);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, id, currentUserSeq]);

  useFocusEffect(
    useCallback(() => {
      const fetchToken = async () => {
        const storedToken = await AsyncStorage.getItem('jwt_token');
        setToken(storedToken);
      };
      fetchToken();
    }, [])
  );

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [token, fetchReviews]);

  return (
    <View style={styles.container}>
      <View style={styles.reviewContents}>
        {reviewList.length > 0 ? (
          reviewList.map(reviewItem => (
            <DetailReviewItems
              key={reviewItem.reviewSeq}
              userName={reviewItem.userName}
              userSeq={reviewItem.userSeq}
              content={reviewItem.content}
              supplementId={reviewItem.supplementSeq}
              reviewId={reviewItem.reviewSeq}
              nickName={reviewItem.nickName}
              onUpdateReviews={fetchReviews}
            />
          ))
        ) : (
          <Text style={styles.noReviewText}>작성된 리뷰가 없습니다.</Text>
        )}
      </View>
      {!hasWrittenReview && (
        <DetailReviewInput onReviewSubmit={fetchReviews} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewContents: {
    height: '70%',
    width: '95%',
    marginTop: 25,
    marginLeft: 10,
  },
  noReviewText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default DetailReview;
