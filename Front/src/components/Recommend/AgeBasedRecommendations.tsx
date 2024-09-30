import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RecommendItem from '../../components/Recommend/RecommendItem';
import {useSelector} from 'react-redux';

type RecommendPill = {
  id: number;
  imageUrl: string;
  pillName: string;
};

interface Props {
  age: number;
  recommendPills: RecommendPill[];
}

const AgeBasedRecommendations = (props: Props) => {
  const nickname = useSelector(
    (state: {nickname: string | null}) => state.nickname,
  );

  const {age, recommendPills} = props;
  // const age2 = Math.floor(age / 10) * 10;

  return (
    <View style={styles.recommendBox}>
      <Text style={styles.recommendText}>
        {nickname}님 에게 맞는 영양제 추천
      </Text>
      <View style={styles.itemsContainer}>
        {recommendPills.map(recommendPill => (
          <RecommendItem
            key={recommendPill.id}
            id={recommendPill.id}
            imageUrl={recommendPill.imageUrl}
            pillName={recommendPill.pillName}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recommendBox: {
    marginTop: 25,
  },
  recommendText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default AgeBasedRecommendations;
