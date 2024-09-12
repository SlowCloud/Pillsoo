import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import MyPageReviewItems from '../../components/MyPage/MyPageReviewItems';

export type pillInfo = {
  name: string;
  imageUrl: string;
}

export type MyReview = {
  content: string;
  pillInfo: pillInfo;
}

const MyPageReviewListScreen = () => {
  // 프론트가 백한테 유저id 보낸다
  // 백이 프론트한테 유저 정보, 리뷰를 쓴 영양제의 id를 보낸다
  // 프론트가 백한테 영양제 id를 보낸다
  // 백이 프론트한테 영양제 상세 정보를 보낸다


  const myReviews = [
    {content: '이 영양제 너무 좋아요',pillInfo:  {name: '영양제1', imageUrl: '주소주소주소주소'}},
    {content: '이 영양제 짱이예요',pillInfo:  {name: '영양제2', imageUrl: '주소주소주소주소'}},
    {content: '이 영양제 맛있어요 매일 먹어요',pillInfo:  {name: '영양제3', imageUrl: '주소주소주소주소'}},
    {content: '온 가족이 다 먹어요 효과 짱!',pillInfo:  {name: '영양제4', imageUrl: '주소주소주소주소'}},
    {content: '친구가 추천해줬어요',pillInfo:  {name: '영양제5', imageUrl: '주소주소주소주소'}},
    {content: '벌써 3통쨰 먹어요!',pillInfo:  {name: '영양제6', imageUrl: '주소주소주소주소'}},
    {content: '이거 먹고 건강해진 느낌이예요',pillInfo:  {name: '영양제7', imageUrl: '주소주소주소주소'}},
    {content: '다음에 또 살게요!',pillInfo:  {name: '영양제8', imageUrl: '주소주소주소주소'}},
  ]

  const renderMyReview = ({item}: {item: MyReview}) => (
    <MyPageReviewItems
      key={item.content}
      content={item.content}
      name={item.pillInfo.name}
      imageUrl={item.pillInfo.imageUrl}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.myReviewTitle}>내가 작성한 리뷰</Text>
      <FlatList
        data={myReviews}
        renderItem={renderMyReview}
        keyExtractor={(item) => item.content}
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
  }
});

export default MyPageReviewListScreen;
