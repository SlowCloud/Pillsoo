import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RecommendItem from '../../components/Recommend/RecommendItem';

type RecommendPill = {
  id: number;
  imageUrl: string;
};

interface Props {
  age: number;
  recommendPills: RecommendPill[];
}

const AgeBasedRecommendations = (props: Props) => {
  const {age, recommendPills} = props;
  const age2 = Math.floor(age / 10) * 10;

  return (
    <View style={styles.recommendBox}>
      <Text style={styles.recommendText}>{age2}대에게 맞는 영양제 추천</Text>
      <View style={styles.itemsContainer}>
        {recommendPills.map(recommendPill => (
          <RecommendItem
            id={recommendPill.id}
            imageUrl={recommendPill.imageUrl}
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
    fontSize: 15,
    color: 'black',
    marginBottom: 10,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default AgeBasedRecommendations;
