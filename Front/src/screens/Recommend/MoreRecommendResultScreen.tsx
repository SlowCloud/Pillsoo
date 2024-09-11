import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RecommendItem from '../../components/Recommend/RecommendItem';

// 백에서 받아온 영양제 데이터를
// map으로 보여주기
const moreRecommendPills = [
  {id: 1, name: 'pill1', description: '이 약은 어쩌구저쩌구~~~`'},
  {id: 2, name: 'pill2', description: '이 약은 어쩌구저쩌구~~~`'},
  {id: 3, name: 'pill3', description: '이 약은 어쩌구저쩌구~~~`'},
]

const MoreRecommendResultScreen = () => {
  return (
    <View style={styles.container}>
      {moreRecommendPills.map((moreRecommendPill) => (
        <RecommendItem 
          key={moreRecommendPill.id}
          id={moreRecommendPill.id}
          name={moreRecommendPill.name}
          description={moreRecommendPill.description}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MoreRecommendResultScreen;
