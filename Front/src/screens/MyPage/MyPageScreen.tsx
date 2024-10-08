import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setOpenLogoutModal } from '../../store/store';
import LogoutModal from '../../components/MyPage/LogoutModal';

const images = [
  require('../../assets/profile/0.png'),
  require('../../assets/profile/1.png'),
  require('../../assets/profile/2.png'),
  require('../../assets/profile/3.png'),
  require('../../assets/profile/4.png'),
  require('../../assets/profile/5.png'),
  require('../../assets/profile/6.png'),
  require('../../assets/profile/7.png'),
  require('../../assets/profile/8.png'),
  require('../../assets/profile/9.png'),
];

export type MyPageParamList = {
  MyPage: undefined;
  MyPageReviewList: undefined;
  UserUpdate: undefined;
};

export type MyPageReviewScreenNavigationProp = StackNavigationProp<
  MyPageParamList,
  'MyPage'
>;

export type Props = {
  navigation: MyPageReviewScreenNavigationProp;
};

const MyPageScreen: React.FC<Props> = ({navigation}) => {
  const nickname = useSelector((state: {nickname: string | null}) => state.nickname);
  const userId = useSelector((state: {userId: string | null}) => state.userId);
  const userSeq = useSelector((state: {userSeq: number | null}) => state.userSeq);
  const openLogoutModal = useSelector((state: {openLogoutModal: boolean}) => state.openLogoutModal);
  const age = useSelector((state: {age: string | null}) => state.age);
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  // 랜덤 프사
  const imageNumber = userSeq ? userSeq % 10 : 0;

  const goLogout = () => {
    dispatch(setOpenLogoutModal(true))
  };

  const goDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '모든 정보가 삭제됩니다.그래도 탈퇴하시겠습니까?',
      [
        {
          text: '예',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_URL}/api/v1/quit`, {
                headers: {
                  access: `${token}`,
                },
              });
              navigation.navigate('AuthHome');
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          text: '아니요',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <>
      {/* <Header /> */}
      <View style={styles.container}>
        <View style={styles.myPageInfo}>
          <Image
            source={images[imageNumber]}
            // source={require('../../assets/profile/메타츄.png')}
            style={styles.ProfileImage}
          />
          <View style={styles.profileBox}>
            <Text style={styles.profileAge}>{age}세</Text>
            <Text style={styles.profileName}>{nickname}</Text>
            <Text style={styles.profileId}>@{userId}</Text>
          </View>
        </View>
        <View style={styles.myPageMenuBox}>
          <TouchableOpacity
            style={styles.eachMenuBox}
            onPress={() => navigation.navigate('MyPageReviewList')}>
            <Text style={styles.eachMenuText}>내 리뷰 보러가기</Text>
            <Text>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachMenuBox}
            onPress={() => navigation.navigate('UserUpdate')}>
            <Text style={styles.eachMenuText}>회원정보 수정</Text>
            <Text>{'>'}</Text>
          </TouchableOpacity>
          <View style={styles.profileInfoContainer}>
            <TouchableOpacity
              onPress={goLogout}>
              <Text style={styles.eachMenuText}>로그아웃</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity
              onPress={goDeleteAccount}>
              <Text style={styles.eachMenuText}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {openLogoutModal && <LogoutModal navigation={navigation} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  myPageInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ProfileImage: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    marginTop: '15%',
    marginHorizontal: '30%',
  },
  profileName: {
    fontSize: 25,
    color: 'black',
  },
  profileAge: {
    fontSize: 19,
  },
  profileId: {
    fontSize: 16,
  },
  profileBox: {
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
    width: '85%',
  },
  myPageMenuBox: {
    marginTop: '-7%',
    // gap: 2,
  },
  eachMenuBox: {
    flexDirection: 'row',
    height: '20%',
    alignItems: 'center',
    borderTopColor: 'gray',
    borderBottomWidth: 1.2,
    borderBottomColor: '#F6F5F2',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  eachMenuText: {
    color: 'black',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 35,
  },
  logoutModalContainer: {
    zIndex: 2,
    width: '20%',
    height: '15%',
    // top: '50%'
  }
});

export default MyPageScreen;
