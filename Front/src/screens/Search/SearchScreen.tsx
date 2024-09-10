import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // navigation 훅 가져오기
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
    <>
      <Header />
      <View style={styles.container}>
        <Image source={require('../../assets/Pill.png')} style={styles.image} />
        <SearchBar
          placeholder="찾으시는 영양제를 검색해주세요 !"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 100,
  },
});

export default SearchScreen;
