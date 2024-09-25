import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
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
  imageUrl: string;
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
      console.log(myWishList);
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

  const handleItemPress = (supplementSeq: number) => {
    navigation.navigate('Detail', {id: supplementSeq});
  };

  const handlePurchasePress = (pillName: string) => {
    const query = encodeURIComponent(pillName.trim());
    const url = `https://msearch.shopping.naver.com/search/all?query=${query}`;
    Linking.openURL(url);
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <ScrollView>
          {myWishList.length > 0 ? (
            myWishList.map((myWish, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => handleItemPress(myWish.supplementSeq)}>
                  <WishListItem
                    pillName={myWish.pillName}
                    imageUrl={myWish.imageUrl}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => handlePurchasePress(myWish.pillName)}>
                  <Text style={styles.purchaseButtonText}>구매하러가기</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>위시리스트가 비어 있습니다.</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  purchaseButton: {
    backgroundColor: '#D3EBCD',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default WishListScreen;
