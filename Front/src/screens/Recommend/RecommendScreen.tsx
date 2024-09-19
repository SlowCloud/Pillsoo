import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../../components/common/Header';
import RecommendItem from '../../components/Recommend/RecommendItem';
import SelectPillItems from '../../components/Recommend/SelectPillItems';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type RecommendParamList = {
  Recommend: undefined;
  MoreRecommend: undefined;
  RecommendCategory: { category: string };
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
    '피부 건강', '체지방', '혈관', '갑상선', '소화',
    '장 건강', '스트레스', '수면', '면역', '뼈 건강', 
    '노화', '항산화', '콜레스테롤', '간 건강', '혈압',
    '혈당', '치아', '눈 건강', '관절'
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

  const chunkedCategories = chunkArray(categories, 4);
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
                    navigation={navigation}
                  />
                ))}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {lastRow && (
            <View style={styles.lastRow}>
              <View style={styles.categoryFirstItem}>
                <SelectPillItems category={lastRow[0]} navigation={navigation} />
              </View>
              <View style={styles.categorySecondItem}>
                <SelectPillItems category={lastRow[1]} navigation={navigation} />
              </View>
              <View style={styles.categoryThirdItem}>
                <SelectPillItems category={lastRow[2]} navigation={navigation} />
              </View>
              {/* <View style={styles.categoryFourthItem}>
                <SelectPillItems category={lastRow[3]} navigation={navigation} />
              </View> */}
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
  categoryFirstItem: {
    flex: 1,
    marginLeft: -75,
    marginRight: -60,
    alignItems: 'center',
  },
  categorySecondItem: {
    flex: 1,
    marginLeft: -110,
    alignItems: 'center',
  },
  categoryThirdItem: {
    flex: 1,
    marginLeft: -160,
    alignItems: 'center',
  },
  categoryFourthItem: {
    flex: 1,
    marginLeft: -170,
    alignItems: 'center',
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
