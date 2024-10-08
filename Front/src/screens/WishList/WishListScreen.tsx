import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import WishListItem from '../../components/WishList/WishListItem';

interface Wish {
  userSeq: number;
  supplementSeq: number;
  pillName: string;
  functionality: string;
  imageUrl: string;
}

const WishListScreen: React.FC = () => {
  const userSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [myWishList, setMyWishList] = useState<Wish[]>([]);

  const fetchResults = async (token: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/wishlist`, {
        headers: {
          access: `${token}`,
        },
        params: {
          userSeq,
        },
      });
      console.log('내 위시 목록', response.data);
      setMyWishList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTokenAndWishlist = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('jwt_token');
          setToken(storedToken);

          if (storedToken) {
            await fetchResults(storedToken);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchTokenAndWishlist();

      return () => {
        console.log('포커스 떠남');
      };
    }, []),
  );

  const handleItemPress = (supplementSeq: number) => {
    navigation.navigate('Detail', {id: supplementSeq});
  };

  const handleRecommendationPress = () => {
    navigation.navigate('영양제 추천');
  };

  // 위시리스트 항목 제거 처리
  const handleRemoveItem = (supplementSeq: number) => {
    setMyWishList(prevList =>
      prevList.filter(item => item.supplementSeq !== supplementSeq),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {myWishList.length > 0 ? (
          myWishList.map((myWish, index) => (
            <View key={index} style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() => handleItemPress(myWish.supplementSeq)}>
                <WishListItem
                  pillName={myWish.pillName}
                  imageUrl={myWish.imageUrl}
                  supplementSeq={myWish.supplementSeq}
                  userSeq={myWish.userSeq}
                  onRemove={handleRemoveItem} // 항목 제거 콜백 전달
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>위시리스트가 비어있습니다.</Text>
            <TouchableOpacity onPress={handleRecommendationPress}>
              <Text style={styles.recommendationText}>
                영양제를 추천받으시겠습니까?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 30,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  recommendationText: {
    fontSize: 16,
    color: '#00FF00',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default WishListScreen;
