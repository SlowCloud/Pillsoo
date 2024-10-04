import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecommendParamList} from './RecommendScreen';
import {API_URL} from '@env';

type RecommendCategoryScreenNavigationProp = StackNavigationProp<
  RecommendParamList,
  'RecommendCategory'
>;

type RecommendCategoryScreenRouteProp = RouteProp<
  RecommendParamList,
  'RecommendCategory'
>;

type Props = {
  navigation: RecommendCategoryScreenNavigationProp;
  route: RecommendCategoryScreenRouteProp;
};

type RecommendPill = {
  id: number;
  imageUrl: string;
  pillName: string;
};

const RecommendCategoryScreen: React.FC<Props> = ({route, navigation}) => {
  const {category} = route.params;
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const fetchSupplements = async () => {
      await CategorySupplements();
    };

    fetchSupplements();
  }, []);

  const CategorySupplements = async (newPage = 0) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        Alert.alert('로그인 정보가 없습니다.');
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/v1/supplement/effect/${category}`,
        {
          headers: {access: token},
          params: {page: newPage, size: 10},
        },
      );
      const data = response.data.content;

      const pills = await Promise.all(
        data.map(async (item: any) => {
          const pillId = item.supplementSeq;
          const {imageUrl, pillName} = await ImageSupplements(pillId);
          return {id: pillId, imageUrl, pillName};
        }),
      );

      setRecommendPills(newPage === 0 ? pills : [...recommendPills, ...pills]);
    } catch (error) {
      console.error(error);
      Alert.alert('데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const ImageSupplements = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(`${API_URL}/api/v1/supplement/${id}`, {
        headers: {
          access: `${token}`,
        },
      });
      return {
        imageUrl: response.data.imageUrl || '', // 이미지가 없는 경우 빈 문자열
        pillName: response.data.pillName,
      };
    } catch (error) {
      console.log(error);
      return {imageUrl: '', pillName: ''}; // 오류 발생 시 빈 이미지와 이름 반환
    }
  };

  const handlePillPress = (id: number) => {
    navigation.navigate('Detail', {id});
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !loading) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      CategorySupplements(nextPage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category} 관련 영양제</Text>
      <FlatList
        data={recommendPills}
        renderItem={({item}) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePillPress(item.id)}
            style={styles.pillItem}>
            {item.imageUrl ? ( // 이미지 URL이 있을 경우에만 Image 컴포넌트를 렌더링
              <Image source={{uri: item.imageUrl}} style={styles.image} />
            ) : null}
            <Text>{item.pillName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color="#a4f87b" />
          ) : null
        }
      />
      {loading && page === 1 && (
        <ActivityIndicator size="large" color="#a4f87b" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pillItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default RecommendCategoryScreen;
