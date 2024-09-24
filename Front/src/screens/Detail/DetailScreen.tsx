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
  isInKit: boolean;
};

const DetailScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'info' | 'review'>('info');
  const [pillData, setPillData] = useState<PillData | null>(null);
  const route = useRoute<DetailScreenRouteProp>();
  const {id} = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [myWishList, setMyWishList] = useState<boolean>(false);
  const [myKit, setMyKit] = useState<boolean>(false);

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

  // 보충제 데이터 들고오기 (상세 데이터)
  useEffect(() => {
    const fetchPillData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/v1/supplement/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log(data);
        setPillData({
          id: data.supplementSeq,
          name: data.pillName,
          expirationDate: data.expirationDate,
          appearance: data.appearance,
          doseAmount: data.doseAmount,
          storageMethod: data.storageMethod,
          doseGuide: data.doseGuide,
          functionality: data.functionality,
          imageUrl: data.imageUrl,
          isInWishlist: data.inWishlist,
          isInKit: data.inMykit,
        });
        setMyWishList(data.inWishlist);
        setMyKit(data.inMykit);
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
    try {
      if (myWishList) {
        // 위시리스트에서 제거
        await axios.delete(`${API_URL}/api/v1/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userSeq,
            supplementSeq: id,
          },
        });
        setMyWishList(false);
      } else {
        // 위시리스트에 추가
        await axios.post(
          `${API_URL}/api/v1/wishlist`,
          {userSeq, supplementSeq: id},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setMyWishList(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKitBtn = async () => {
    try {
      if (myKit) {
        // 복용 중 목록에서 제거
        const response = await axios.delete(`${API_URL}/api/v1/my-kit`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            supplementSeq: id,
          },
        });

        // 응답 상태를 로그로 확인
        console.log('제거', response.status);

        if (response.status === 200 || response.status === 204) {
          setMyKit(false);
        }
      } else {
        // 복용 중 목록에 추가
        const response = await axios.post(
          `${API_URL}/api/v1/my-kit`,
          {supplementSeq: id},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // 응답 상태를 로그로 확인
        console.log('추가', response.status);

        if (response.status === 200) {
          setMyKit(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Image source={{uri: pillData.imageUrl}} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.pillName}>{pillData.name}</Text>
          <View style={styles.rowContainer}>
            <TouchableOpacity onPress={handleWishListBtn}>
              <Image
                source={
                  myWishList
                    ? require('../../assets/heart1.png') // 위시리스트에 있을 때
                    : require('../../assets/heart2.png') // 위시리스트에 없을 때
                }
                style={styles.wishListBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleKitBtn}>
              <Text style={styles.dosageText}>
                {myKit ? '복용 중' : '복용 안 함'}
              </Text>
            </TouchableOpacity>
          </View>
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center', // 수직 가운데 정렬
    marginTop: 10,
  },
  dosageText: {
    marginLeft: 10, // 이미지와 텍스트 사이 간격
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
