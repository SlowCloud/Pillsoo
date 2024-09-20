import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '@env';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';
import DetailInfo from '../../components/Detail/DetailInfo';
import DetailReview from '../../components/Detail/DetailReview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

export type PillData = {
  id: number;
  name: string;
  expirationDate: string;
  appearance: string;
  doseAmount: string;
  storageMethod: string;
  doseGuide: string;
  functionality: string;
  imageUrl: string;
  isInWishlist: boolean;
};

const DetailScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'info' | 'review'>('info');
  const [pillData, setPillData] = useState<PillData | null>(null);
  const route = useRoute<DetailScreenRouteProp>();
  const {id} = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [myWishList, setMyWishList] = useState<boolean>(false);

  const userSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchPillData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `http://10.0.2.2:8080/api/v1/supplement/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = response.data;
        console.log(data);
        setPillData({
          id: data.supplementSeq,
          name: data.pillName,
          expirationDate: data.expirationDate,
          // 유통기한
          appearance: data.appearance,
          // 생김새
          doseAmount: data.doseAmount,
          // 섭취방법
          storageMethod: data.storageMethod,
          // 보관방법
          doseGuide: data.doseGuide,
          // 주의사항
          functionality: data.functionality,
          // 효능
          imageUrl: data.imageUrl,
          isInWishlist: data.inWishlist,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchPillData();
  }, [id, token]);

  if (!pillData) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleWishListBtn = async () => {
    setMyWishList(prev => !prev);
    // if (myWishList === true) {
    //   try {
    //     const response = await axios.post(
    //       'http://10.0.2.2:8080/api/v1/wishlist',
    //       { "userSeq": userSeq, "supplementSeq": id },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       },
    //     )
    //   } catch(error) {
    //     console.log(error)
    //   }
    // } else {
    //     try {
    //       const response = await axios.delete(
    //         'http://10.0.2.2:8080/api/v1/wishlist',
    //         { "userSeq": userSeq, "supplementSeq": id },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         },
    //       )
    //     } catch(error) {
    //       console.log(error)
    //     }
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Image source={{uri: pillData.imageUrl}} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.pillName}>{pillData.name}</Text>
          <TouchableOpacity onPress={handleWishListBtn}>
            {myWishList ? (
              <Image
                source={require('../../assets/heart1.png')}
                style={styles.wishListBtn}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../assets/heart2.png')}
                style={styles.wishListBtn}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.canSelectMenu}>
        <TouchableOpacity
          style={
            selectedTab === 'info'
              ? styles.selectedTextBox
              : styles.notSelectedTextBox
          }
          onPress={() => setSelectedTab('info')}>
          <Text
            style={
              selectedTab === 'info'
                ? styles.selectedText
                : styles.notSelectedText
            }>
            상세 정보
          </Text>
          <View
            style={selectedTab === 'info' ? styles.selectedCheck : null}></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedTab === 'review'
              ? styles.selectedTextBox
              : styles.notSelectedTextBox
          }
          onPress={() => setSelectedTab('review')}>
          <Text
            style={
              selectedTab === 'review'
                ? styles.selectedText
                : styles.notSelectedText
            }>
            리뷰
          </Text>
          <View
            style={
              selectedTab === 'review' ? styles.selectedCheck : null
            }></View>
        </TouchableOpacity>
      </View>
      <View style={styles.selectedContent}>
        {selectedTab === 'info' ? (
          <DetailInfo pillData={pillData} />
        ) : (
          <DetailReview id={pillData.id} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    marginVertical: 45,
  },
  infoBox: {
    height: '20%',
    flexDirection: 'row',
  },
  image: {
    width: '40%',
    marginTop: 10,
    resizeMode: 'contain',
  },
  pillName: {
    fontSize: 15,
    color: 'black',
    marginTop: 40,
    marginRight: 10,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  canSelectMenu: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  selectedTextBox: {
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderColor: '#939185',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notSelectedTextBox: {
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderColor: '#939185',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 20,
    color: 'black',
  },
  notSelectedText: {
    fontSize: 20,
    color: '#939185',
  },
  selectedCheck: {
    width: 40,
    height: 10,
    marginTop: 11,
    backgroundColor: '#D3EBCD',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  selectedContent: {
    height: '65%',
    borderWidth: 1,
    borderColor: '#939185',
    borderBlockStartColor: '#F7F7F7',
  },
  wishListBtn: {
    width: 30,
  },
});

export default DetailScreen;
