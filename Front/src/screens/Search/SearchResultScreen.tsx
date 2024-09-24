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

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const fetchResults = async () => {
    if (!searchQuery.trim() || !token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/supplement/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          searchtext: searchQuery,
          functionality: '',
        },
      });

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
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Detail', {id: item.supplementSeq})}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <Text style={styles.pillName}>{item.pillName}</Text>
    </TouchableOpacity>
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchResultScreen;
