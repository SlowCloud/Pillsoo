import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import Header from '../../components/common/Header';
import AgeBasedRecommendations from '../../components/Recommend/AgeBasedRecommendations';
import SelectPillItems from '../../components/Recommend/SelectPillItems';
import {TouchableOpacity} from 'react-native-gesture-handler';

export type RecommendParamList = {
  Recommend: undefined;
  MoreRecommend: undefined;
  RecommendCategory: {category: string};
};

export type Props = {
  navigation: any;
};

export type RecommendPill = {
  id: number;
  imageUrl: any;
};

const RecommendScreen: React.FC<Props> = ({navigation}) => {
  const [age, setAge] = useState<number>(25);
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);

  // 화면 렌더링 되자마자 함수 실행
  useEffect(() => {
    AgeRecommendPills();
  }, []);

  // 나이대별 추천 영양제 조회
  const AgeRecommendPills = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(
        `${API_URL}/api/v1/recommend?age=${age}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data;
      console.log(data);
      const pills = data.map((item: any) => ({
        id: item.supplementSeq,
        imageUrl: {uri: item.image_url},
      }));

      setRecommendPills(pills);
    } catch (error) {
      console.log(error);
    }
  };

  // 카테고리
  const categories: string[] = [
    '간 건강',
    '갑상선',
    '관절',
    '노화',
    '눈 건강',
    '면역',
    '뼈 건강',
    '소화',
    '수면',
    '스트레스',
    '장 건강',
    '체지방',
    '치아',
    '콜레스테롤',
    '피부 건강',
    '항산화',
    '혈관',
    '혈당',
    '혈압',
  ];

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
        <AgeBasedRecommendations age={age} recommendPills={recommendPills} />
        <View style={styles.pillCategoryBox}>
          <FlatList
            data={chunkedCategories}
            renderItem={({item}) => (
              <View style={styles.categoryRow}>
                {item.map(category => (
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
              {lastRow.map(category => (
                <SelectPillItems
                  key={category}
                  category={category}
                  navigation={navigation}
                />
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.recommendBtn}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('MoreRecommend')}>
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
