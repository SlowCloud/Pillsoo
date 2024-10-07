import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import DetailReviewInput from './DetailReviewInput';
import DetailReviewItems from './DetailReviewItems';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';

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
  // 리뷰 작성 여부 상태

  // Redux에서 userSeq 가져오기
  const currentUserSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );

  // 토큰 가져오기
  useFocusEffect(
    useCallback(() => {
      const fetchToken = async () => {
        const storedToken = await AsyncStorage.getItem('jwt_token');
        setToken(storedToken);
      };

      fetchToken();
    }, []),
  );

  // 리뷰 가져오기
  useFocusEffect(
    useCallback(() => {
      const fetchReviews = async () => {
        if (!token) return;

        try {
          const response = await axios.get(
            `${API_URL}/api/v1/supplement/${id}/reviews`,
            {
              headers: {
                access: `${token}`,
              },
            },
          );
          if (response.status === 200) {
            setReviewList(response.data);

            // 현재 사용자가 작성한 리뷰가 있는지 확인
            const userReview = response.data.find(
              (review: Review) => review.userSeq === currentUserSeq,
            );
            setHasWrittenReview(!!userReview);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchReviews();
    }, [id, token, currentUserSeq, reviewList]),
  );

  return (
    <View style={styles.container}>
      {/* <ScrollView> */}
      <View style={styles.reviewContents}>
        {reviewList.map(reviewItem => (
          <DetailReviewItems
            key={reviewItem.reviewSeq}
            userName={reviewItem.userName}
            userSeq={reviewItem.userSeq}
            content={reviewItem.content}
            supplementId={reviewItem.supplementSeq}
            reviewId={reviewItem.reviewSeq}
            nickName={reviewItem.nickName}
          />
        ))}
      </View>
      {/* </ScrollView> */}
      {/* 사용자가 이미 리뷰를 작성한 경우 리뷰 입력란 숨기기 */}
      {!hasWrittenReview && <DetailReviewInput />}
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
    // borderWidth: 1,
    marginLeft: 10,
  },
});

export default DetailReview;
