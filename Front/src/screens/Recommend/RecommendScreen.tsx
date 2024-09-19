import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../../components/common/Header';
import RecommendItem from '../../components/Recommend/RecommendItem';
import SelectPillItems from './SelectPillItems';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type RecommendParamList = {
  Recommend: undefined;
  MoreRecommend: undefined;
}

export type RecommendScreenNavigationProp = StackNavigationProp<
  RecommendParamList,
  'Recommend'
>

export type Props = {
  navigation: RecommendScreenNavigationProp;
};

type RecommendPill = {
  id: number;
  imageUrl: any;
}

const RecommendScreen: React.FC<Props> = ({ navigation }) => {
  const [age, setAge] = useState<number>(0);
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);

  const categories: string[] = [
    '눈 건강', '피부 건강', '체지방', '혈관 & 혈액순환',  '호흡기 건강',
    '간 건강', '면역 기능', '혈압',  '탈모 & 손톱 건강', '여성 건강',
    '뼈 건강', '노화 & 항산화', '남성 건강', '빈혈',  '스트레스 & 수명', 
    '운동 능력 & 근육량', '두뇌활동', '혈당', '피로감', '치아 & 칫몸',
    '갑상선 건강', '관절 건강', '여성 갱년기', '장 건강', '혈중 중성지방', 
    '혈중 콜레스테롤', '소화 & 위식도 건강', '임산부 & 태아 건강',
  ];

  useEffect(() => {
    setAge(20);
    setRecommendPills([
      { id: 1, imageUrl: require('../../assets/profile/3.png') },
      { id: 2, imageUrl: require('../../assets/profile/3.png') },
      { id: 3, imageUrl: require('../../assets/profile/3.png') },
    ]);
  }, []);

  const chunkArray = (array: string[], size: number) => {
    const result: string[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const chunkedCategories = chunkArray(categories, 5);
  const lastRow = chunkedCategories.pop();

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.recommendText}>{age}대에게 맞는 영양제 추천</Text>
        <View style={styles.recommendBox}>
          {recommendPills.map((recommendPill) => (
            <RecommendItem
              key={recommendPill.id}
              id={recommendPill.id}
              imageUrl={recommendPill.imageUrl}
            />
          ))}
        </View>
        <View style={styles.pillCategoryBox}>
          <FlatList
            data={chunkedCategories}
            renderItem={({ item }) => (
              <View style={styles.categoryRow}>
                {item.map((category) => (
                  <SelectPillItems
                    key={category}
                    category={category}
                  />
                ))}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {lastRow && (
            <View style={styles.lastRow}>
              <View style={styles.leftAligned}>
                {lastRow.slice(0, 1).map((category) => (
                  <SelectPillItems key={category} category={category} />
                ))}
              </View>
              <View style={styles.centerAligned}>
                {lastRow.slice(1, 2).map((category) => (
                  <SelectPillItems key={category} category={category} />
                ))}
              </View>
              <View style={styles.rightAligned}>
                {lastRow.slice(2).map((category) => (
                  <SelectPillItems key={category} category={category} />
                ))}
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.recommendBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MoreRecommend')}
        >
          <Text style={styles.moreRecommendText}>더 많은 영양제 추천받기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 50,
  },
  recommendText: {
    fontSize: 15,
    color: 'black',
    marginBottom: 10,
  },
  recommendBox: {
    marginTop: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pillCategoryBox: {
    width: '100%',
    marginTop: 70,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftAligned: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  centerAligned: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAligned: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recommendBtn: {
    marginTop: 85,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#D3EBCD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreRecommendText: {
    color: 'black',
    fontSize: 16,
  },
});

export default RecommendScreen;
