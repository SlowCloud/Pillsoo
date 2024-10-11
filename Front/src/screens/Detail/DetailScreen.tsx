import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '@env';
import {RecommendItemParamList} from '../../components/Recommend/RecommendItem';
import DetailInfo from '../../components/Detail/DetailInfo';
import DetailReview from '../../components/Detail/DetailReview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import CommonModal from '../../components/common/Modal';
import FastImage from 'react-native-fast-image';


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
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalImage, setModalImage] = useState<any>(null);

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
        const response = await axios.get(`${API_URL}/api/v1/supplement/${id}`, {
          headers: {
            access: `${token}`,
          },
        });
        const data = response.data;
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
        console.log(error);
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
        await axios.delete(`${API_URL}/api/v1/wishlist`, {
          headers: {
            access: `${token}`,
          },
          params: {
            userSeq,
            supplementSeq: id,
          },
        });
        setMyWishList(false);
        setModalMessage('위시리스트에서 제거되었습니다!');
        setModalImage(require('../../assets/remove.gif'));
      } else {
        await axios.post(
          `${API_URL}/api/v1/wishlist`,
          {userSeq, supplementSeq: id},
          {
            headers: {
              access: `${token}`,
            },
          },
        );
        setMyWishList(true);
        setModalMessage('위시리스트에 추가되었습니다!');
        setModalImage(require('../../assets/wishlistadd.gif'));
      }
      setModalVisible(true);

      // setTimeout(() => {
      //   setModalVisible(false);
      // }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKitBtn = async () => {
    try {
      if (myKit) {
        const response = await axios.delete(`${API_URL}/api/v1/cabinet`, {
          headers: {
            access: `${token}`,
          },
          params: {
            supplementSeq: id,
          },
        });

        console.log('제거', response.status);

        if (response.status === 200 || response.status === 204) {
          setMyKit(false);
          setModalMessage('마이키트에서 제거되었습니다!');
          setModalImage(require('../../assets/remove.gif'));
        }
      } else {
        const response = await axios.post(
          `${API_URL}/api/v1/cabinet`,
          {supplementSeq: id},
          {
            headers: {
              access: `${token}`,
            },
          },
        );

        console.log('추가', response.status);

        if (response.status === 200) {
          setMyKit(true);
          setModalMessage('마이키트에 추가되었습니다!');
          setModalImage(require('../../assets/mykitadd.gif'));
        }
      }
      setModalVisible(true);

      // setTimeout(() => {
      //   setModalVisible(false);
      // }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.infoBox}>
        <Image source={{uri: pillData.imageUrl}} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.pillName}>{pillData.name}</Text>
          <View style={styles.rowContainer}>
            <TouchableOpacity onPress={handleWishListBtn}>
              <FastImage
                source={
                  myWishList
                    ? require('../../assets/heart1.png') // 위시리스트에 있을 때
                    : require('../../assets/heart2.png') // 위시리스트에 없을 때
                }
                style={styles.wishListBtn}
                resizeMode={FastImage.resizeMode.contain} // FastImage 사용 시 resizeMode 지정
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleKitBtn}>
              <Text style={styles.dosageText}>
                {myKit ? '마이키트에서 제거' : '마이키트에 추가'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.canSelectMenu}>
        <TouchableOpacity
          style={
            selectedTab === 'info'
              ? [styles.selectedTextBox, styles.leftBorder]
              : [styles.notSelectedTextBox, styles.leftBorder]
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
              ? [styles.selectedTextBox, styles.rightBorder]
              : [styles.notSelectedTextBox, styles.rightBorder]
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

      <CommonModal
        visible={isModalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        imageSource={modalImage}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
    padding: 20,
    paddingTop: 40,
  },
  infoBox: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pillName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  wishListBtn: {
    width: 30,
    height: 30,
    marginRight: 15,
    transform: [{ scale: 1.1 }],
  },
  dosageText: {
    fontSize: 14,
    // color: '#00FF00',
    color: 'green',
    backgroundColor: '#e6f9ec',
    borderColor: '#00FF00',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  canSelectMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: '#f4f7fc',
  },
  selectedTextBox: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#00FF00',
    borderRadius: 20,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  notSelectedTextBox: {
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8ecf3',
    borderRadius: 20,
    margin: 10
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notSelectedText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedCheck: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    height: 4,
    width: '40%',
    backgroundColor: '#00FF00',
    borderRadius: 2,
    transform: [{ translateX: -20 }],
  },
  selectedContent: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  leftBorder: {
    borderRightWidth: 0,
  },
  rightBorder: {
    borderLeftWidth: 0,
  },
});

export default DetailScreen;



