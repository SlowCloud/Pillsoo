import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SearchBar from '../../components/common/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

const SearchResultScreen = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  // 현재 페이지
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // 더 많은 결과를 가져오는지

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const fetchResults = async (newPage = 1) => {
    if (!searchQuery.trim() || !token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/supplement/search`, {
        headers: {
          access: `${token}`,
        },
        params: {
          searchtext: searchQuery,
          functionality: '',
          page: newPage,
          // 새로운 페이지 번호 사용
          size: 10,
        },
      });
      if (response.status === 200) {
        if (newPage === 1) {
          setResults(response.data.content);
          // 결과 초기화
        } else {
          setResults(prevResults => [...prevResults, ...response.data.content]);
          // 새로운 결과 추가
        }
      } else {
        Alert.alert('검색 실패');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('검색 실패');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // 페이지가 바뀔 때마다 결과를 가져옴
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isFetchingMore && !loading) {
      // 중복 요청 방지
      setIsFetchingMore(true);
      const nextPage = page + 1;
      // 다음 페이지로 증가
      setPage(nextPage);
      fetchResults(nextPage);
      // 다음 페이지 결과를 가져옴
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Detail', {id: item.supplementSeq})}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <Text style={styles.pillName} numberOfLines={1} ellipsizeMode="tail">
        {item.pillName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="검색어를 입력하세요 !"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={fetchResults}
          />
        </View>

        {loading && page === 1 ? (
          // 초기 로딩 상태
          <ActivityIndicator size="large" color="#a4f87b" />
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={item => item.supplementSeq.toString()}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            // 스크롤 시 더 많은 결과를 가져옴
            onEndReachedThreshold={0.5}
            // 리스트의 50%가 보일 때 호출
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator size="small" color="#a4f87b" />
              ) : null
            }
          />
        ) : (
          <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    padding: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchResultScreen;
