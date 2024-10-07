import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import AgeBasedRecommendations from '../../components/Recommend/AgeBasedRecommendations';
import SelectPillItems from '../../components/Recommend/SelectPillItems';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

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
  pillName: string;
  isRandom: boolean;
};

const RecommendScreen: React.FC<Props> = ({navigation}) => {
  const age = useSelector((state: {age: number | null}) => state.age);
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      AgeRecommendPills();
    }, [age]),
  );

  // 나이별 영양제 추천
  const AgeRecommendPills = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(
        `${API_URL}/api/v1/recommend?age=${age}`,
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      const data = response.data;
      console.log('영양제 추천', response.data);
      const pills = data.map((item: any) => ({
        id: item.supplementSeq,
        imageUrl: {uri: item.image_url},
        pillName: item.pill_name,
        isRandom: item._random,
      }));
      setRecommendPills(pills);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <View style={styles.container}>
      <AgeBasedRecommendations
        age={age}
        recommendPills={recommendPills}
        isLoading={isLoading}
      />
      <View style={styles.pillCategoryBox}>
        <Text style={styles.categoryText}>건강 카테고리별 영양제 추천</Text>
        <FlatList
          data={chunkedCategories}
          renderItem={({item, index}) => (
            <View style={styles.categoryRow} key={index}>
              {item.map(category => (
                <SelectPillItems
                  key={category}
                  category={category}
                  navigation={navigation}
                  style={{marginRight: 10}}
                />
              ))}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false} // 스크롤 바 표시 여부
        />
        {lastRow && (
          <View style={styles.lastRow}>
            {lastRow.map((category, index) => (
              <SelectPillItems
                key={`${category}-${index}`}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  pillCategoryBox: {
    marginTop: 30,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 18,
    color: 'black',
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  recommendBtn: {
    marginTop: 30,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#a4f87b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreRecommendText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RecommendScreen;
