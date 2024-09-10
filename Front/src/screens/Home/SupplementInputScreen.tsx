import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SearchBar from '../../components/common/SearchBar'; // SearchBar 컴포넌트 임포트

const SupplementInputScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    console.log('검색어:', searchQuery);
    setSearchQuery(' ');
  };

  return (
    <>
      <View style={styles.container}>
        <SearchBar
          placeholder="복용하시고 있는 영양제를 입력해주세요 !"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
        />
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'OCR',
            })
          }>
          <Text style={styles.scanText}>스캔해서 입력하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  scanText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupplementInputScreen;
