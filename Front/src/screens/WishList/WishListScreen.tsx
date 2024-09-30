import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from '../../components/common/Header';
import WishListItem from '../../components/WishList/WishListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';

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

  return (
    <>
      {/* <Header /> */}
      <View style={styles.container}>
        {/* <View style={styles.textContainer}>
          <Text style={styles.text}>나의 위시 리스트</Text>
        </View> */}
        <ScrollView>
          {myWishList.length > 0 ? (
            myWishList.map((myWish, index) => (
              <View key={index} style={styles.cardContainer}>
                <TouchableOpacity
                  onPress={() => handleItemPress(myWish.supplementSeq)}>
                  <WishListItem
                    pillName={myWish.pillName}
                    imageUrl={myWish.imageUrl}
                  />
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
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 60,
  },
  textContainer: {
    margin: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 28,
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
});

export default WishListScreen;
