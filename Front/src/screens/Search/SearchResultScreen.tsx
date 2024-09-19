import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
// import {useRoute, RouteProp} from '@react-navigation/native';
import SearchBar from '../../components/common/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

// type HomeStackParamList = {
//   SearchResult: {query: string};
// };

const SearchResultScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  // const route = useRoute<RouteProp<HomeStackParamList, 'SearchResult'>>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(' ');

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const fetchResults = async () => {
    if (!searchQuery.trim() || !token) return;
    // 검색어가 비어 있거나, 토큰이 없으면 함수를 종료한다.

    setLoading(true);
    try {
      const response = await axios.get(
        // 'http://10.0.2.2:8080/api/v1/supplement/search',
        `${API_URL}/api/v1/supplement/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            searchtext: searchQuery,
            functionality: '',
          },
        },
      );

      if (response.status === 200) {
        setResults(response.data);
      } else {
        Alert.alert('검색 실패');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('검색 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchQuery]);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.resultItem}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      {/* 이미지를 가져올 url을 지정 */}
      <Text style={styles.pillName}>{item.pillName}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="검색어를 입력하세요 !"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={fetchResults}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#a4f87b" />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.supplementSeq.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  },
  functionality: {
    fontSize: 14,
    color: '#555',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchResultScreen;
