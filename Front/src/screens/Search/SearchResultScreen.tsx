import React, {useState, useEffect, useCallback} from 'react';
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
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
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const fetchResults = async (newPage = 0) => {
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
          size: 10,
        },
      });
      if (response.status === 200) {
        if (newPage === 0) {
          setResults(response.data.content);
        } else {
          setResults(prevResults => [...prevResults, ...response.data.content]);
        }
      } else {
        Alert.alert('검색 실패');
      }
    } catch (error) {
      // Alert.alert('검색하신 영양제가 존재하지 않습니다.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // 화면이 포커스될 때 초기화
  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setResults([]);
      setPage(1);
    }, []),
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]); // 검색어가 비어있으면 결과를 빈 배열로 설정합니다.
      setPage(0); // 페이지도 1로 초기화합니다.
    } else {
      fetchResults(0); // 검색어가 있을 때 결과를 가져옵니다.
    }
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isFetchingMore && !loading) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage);
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
    <View style={styles.screen}>
      <Text style={styles.headerText}>찾으시는 영양제를 검색해주세요 !</Text>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="검색어를 입력하세요 !"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={fetchResults}
        />
      </View>

      <View style={styles.resultsContainer}>
        {loading && page === 1 ? (
          <ActivityIndicator size="large" color="#00FF00" />
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.supplementSeq}-${index}`}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator size="small" color="#00FF00" />
              ) : null
            }
          />
        ) : searchQuery.trim() === '' ? (
          <Text style={styles.noResultsText}>검색어를 입력하세요.</Text>
        ) : (
          <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 30,
  },
  searchBarContainer: {
    paddingTop: 40,
    padding: 16,
  },
  resultsContainer: {
    flex: 1,
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
  },
  resultItem: {
    padding: 16,
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
    color: 'black',
    fontWeight: 'bold',
  },
});

export default SearchResultScreen;
