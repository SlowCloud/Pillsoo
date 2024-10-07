import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {setOpenLogoutModal} from '../../store/store';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';

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

const LogoutModal: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();

  const goLogout = async () => {
    const storedToken = await AsyncStorage.getItem('jwt_token');

    try {
      const response = await axios.post(`${API_URL}/api/v1/signout`, {
        headers: {
          access: `${storedToken}`,
        },
      });
      AsyncStorage.clear();

      navigation.navigate('AuthHome');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal style={styles.modalContainer} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContentContainer}>
          <Image
            source={require('../../assets/logout.png')}
            style={styles.logoutImage}></Image>
          <TouchableOpacity onPress={() => dispatch(setOpenLogoutModal(false))}>
            <View>
              <Text style={styles.message2}>로그아웃 하시겠습니까?</Text>
            </View>
            <View style={styles.messageContainer}>
              <TouchableOpacity onPress={goLogout}>
                <View style={styles.message1Container}>
                  <Text style={styles.message1}>예</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => dispatch(setOpenLogoutModal(false))}>
                <View style={styles.message3Container}>
                  <Text style={styles.message2}>아니요</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '30%',
    height: '40%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    width: 300,
    padding: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutImage: {
    width: 75,
    height: 75,
    bottom: 15,
    resizeMode: 'contain',
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message1Container: {
    borderRadius: 5,
    backgroundColor: '#7bf898',
    width: 65,
    height: 35,
  },
  message1: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 15,
    marginVertical: 2,
  },
  message2: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  message3Container: {
    borderRadius: 5,
    width: 85,
    height: 35,
    bottom: -3,
  },
});

export default LogoutModal;
