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
  // 현재 페이지
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // 추가 데이터를 가져오는 중인지 여부

  useEffect(() => {
    const fetchSupplements = async () => {
      await CategorySupplements();
    };

    fetchSupplements();
  }, []);

  const CategorySupplements = async (newPage = 1) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/v1/supplement/effect/${category}`,
        {
          headers: {
            access: `${token}`,
          },
          params: {
            functionality: '',
            page: newPage,
            size: 10,
          },
        },
      );
      const data = response.data.content;
      console.log(data);
      const pills = await Promise.all(
        data.map(async (item: any) => {
          const pillId = item.supplementSeq;
          const {imageUrl, pillName} = await ImageSupplements(pillId);
          return {
            id: pillId,
            imageUrl,
            pillName,
          };
        }),
      );
      if (newPage === 1) {
        setRecommendPills(pills);
        // 새로운 페이지로 초기화
      } else {
        setRecommendPills(prevPills => [...prevPills, ...pills]);
        // 기존 결과에 추가
      }
    } catch (error) {
      console.log(error);
      Alert.alert('영양제를 가져오는 중 오류가 발생했습니다.');
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
        imageUrl: response.data.imageUrl,
        pillName: response.data.pillName,
      };
    } catch (error) {
      console.log(error);
      return {imageUrl: '', pillName: ''};
    }
  };

  const handlePillPress = (id: number) => {
    navigation.navigate('Detail', {id});
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !loading) {
      // 중복 요청 방지
      setIsFetchingMore(true);
      const nextPage = page + 1;
      // 다음 페이지로 증가
      setPage(nextPage);
      CategorySupplements(nextPage);
      // 다음 페이지의 결과를 가져옴
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category} 관련 영양제</Text>
      <FlatList
        data={recommendPills}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handlePillPress(item.id)}
            style={styles.pillItem}>
            <Image source={{uri: item.imageUrl}} style={styles.image} />
            <Text>{item.pillName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        // 스크롤 시 더 많은 결과를 가져옴
        onEndReachedThreshold={0.5}
        // 리스트의 50%가 보일 때 호출
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color="#a4f87b" />
          ) : null
        } // 추가 로딩 인디케이터
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
