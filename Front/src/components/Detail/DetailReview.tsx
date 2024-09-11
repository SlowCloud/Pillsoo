import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DetailReviewInput from './DetailReviewInput';
import DetailReviewItems from './DetailReviewItems';


export type DetailReviewProps = {
  id: number;
}
const DetailReview: React.FC<DetailReviewProps> = ({id}) => {
  // 백한테 아이디 보내기
  // 그럼 리뷰 목록을 받을 수 있겠지
  // const [reviewList, setReviewList] = useState<>
  const reviewList = [
    {id:1, name: 'name1', content: 'goodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgood'},
    {id:2, name: 'name2', content: 'bad'},
  ]

  return (
    <View style={styles.container}>
      <View style={styles.reviewContents}>
      {reviewList.map((reviewItem) => (
        <DetailReviewItems 
          key={reviewItem.id}
          name={reviewItem.name}
          content={reviewItem.content}
        />
      ))}
      </View>
      <DetailReviewInput />
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
  }
});

export default DetailReview;
