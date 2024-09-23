import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/common/Header';
import WishListItem from '../../components/WishList/WishListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

interface Wish {
  userSeq: number;
  supplementSeq: number;
  pillName: string;
  functionality: string;
}

const WishListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [myWishList, setMyWishList] = useState<Wish[]>([]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyWishList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchResults();
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        fetchResults();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const handleItemPress = (supplementSeq: number) => {
    navigation.navigate('Detail', {id: supplementSeq});
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        {myWishList.length > 0 ? (
          myWishList.map((myWish, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleItemPress(myWish.supplementSeq)}>
              <WishListItem
                userSeq={myWish.userSeq}
                supplementSeq={myWish.supplementSeq}
                pillName={myWish.pillName}
                functionality={myWish.functionality}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text>위시리스트가 비어 있습니다.</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});

export default WishListScreen;
