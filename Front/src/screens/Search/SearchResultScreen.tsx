import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import SearchBar from '../../components/common/SearchBar';
import {useNavigation} from '@react-navigation/native';

type HomeStackParamList = {
  SearchResult: {query: string};
};

const SearchResultScreen = () => {
  const route = useRoute<RouteProp<HomeStackParamList, 'SearchResult'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const {query} = route.params;
  const navigation = useNavigation();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
    navigation.navigate('Home', {
      screen: 'SearchResult',
      params: {query: searchQuery},
    });
    setSearchQuery('');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder={query}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.text}>검색 결과: {query}</Text>
      </View>
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
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default SearchResultScreen;
