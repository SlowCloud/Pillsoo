import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecommendParamList } from './RecommendScreen';
import { API_URL } from '@env';

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

const screenWidth = Dimensions.get('window').width;

const RecommendCategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { category } = route.params;
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const fetchSupplements = async () => {
      await CategorySupplements(0);
    };

    fetchSupplements();
  }, []);

  const CategorySupplements = async (newPage: number) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        Alert.alert('로그인 정보가 없습니다.');
        return;
      }

      newPage === 0 ? setLoading(true) : setIsFetchingMore(true);

      const response = await axios.get(
        `${API_URL}/api/v1/supplement/effect/${category}`,
        {
          headers: { access: token },
          params: { page: newPage, size: 10 },
        }
      );
      const data = response.data.content;

      const pills = await Promise.all(
        data.map(async (item: any) => {
          const pillId = item.supplementSeq;
          const { imageUrl, pillName } = await ImageSupplements(pillId);
          return { id: pillId, imageUrl, pillName };
        })
      );

      setRecommendPills(prevPills =>
        newPage === 0 ? pills : [...prevPills, ...pills]
      );
      setPage(newPage);
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
        imageUrl: response.data.imageUrl || '',
        pillName: response.data.pillName,
      };
    } catch (error) {
      console.error(error);
      return { imageUrl: '', pillName: '' };
    }
  };

  const handlePillPress = (id: number) => {
    navigation.navigate('Detail', { id });
  };

  const handleLoadMore = () => {
    if (!isFetchingMore) {
      CategorySupplements(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00FF00" />
          <Text style={styles.loadingText}>영양제 추천 받는 중...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.subTitle}>부족한 영양소에 대한</Text>
          <Text style={styles.headerTitle}>필수 추천 영양제</Text>
          <Text style={styles.categoryTitle}>
            <Text style={styles.highlightedCategory}>{category}</Text>이 좋지 않다면?
          </Text>
          <FlatList
            data={recommendPills}
            renderItem={({ item, index }) => (
              <View key={item.id} style={styles.pillItem}>
                <View style={styles.imageContainer}>
                  <Text style={styles.rankText}>{`${index + 1}위`}</Text>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  ) : null}
                  {isFetchingMore && (
                    <ActivityIndicator style={styles.inlineLoader} size="small" color="#00FF00" />
                  )}
                </View>
                <Text style={styles.pillName}>{item.pillName}</Text>
                <TouchableOpacity
                  onPress={() => handlePillPress(item.id)}
                  style={styles.detailButton}
                >
                  <Text style={styles.detailButtonText}>상세보기</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.flatListContent}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  subTitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 30,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 40,
    marginLeft: 10,
  },
  highlightedCategory: {
    color: '#00FF00',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00FF00',
  },
  pillItem: {
    width: screenWidth * 0.8,
    marginRight: 10,
    marginTop: 100,
    padding: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', 
  },
  rankText: {
    position: 'absolute',
    top: -20,
    // left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 5,
    overflow: 'hidden',
    zIndex: 1,
  },
  image: {
    width: 300,
    height: 160,
    marginBottom: 30,
    borderRadius: 10,
  },
  inlineLoader: {
    marginLeft: 10,
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginTop: 30,
  },
  detailButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 30,
    borderColor: '#00FF00',
    borderWidth: 2,
    width: '60%',
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: '600',
  },
  flatListContent: {
    paddingVertical: 10,
  },
});

export default RecommendCategoryScreen;
