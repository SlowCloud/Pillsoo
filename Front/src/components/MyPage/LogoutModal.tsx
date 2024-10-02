import React from 'react';
import {StyleSheet, View, Text, Modal, TouchableOpacity} from 'react-native';
import { setOpenLogoutModal } from '../../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
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
  const dispatch = useDispatch()

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
  }


  return (
    <Modal 
      style={styles.modalContainer}
      transparent={true}
    >
      <View style={styles.container}>
        <View style={styles.modalContentContainer}>
          <TouchableOpacity
            onPress={() => dispatch(setOpenLogoutModal(false))}
          >
            <View>
              <Text style={styles.message2}>로그아웃 하시겠습니까?</Text>
            </View>
            <View style={styles.messageContainer}>
              <TouchableOpacity
                onPress={goLogout}
              >
                <Text style={styles.message1}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => dispatch(setOpenLogoutModal(false))}
              >
                <Text style={styles.message2}>아니요</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '30%',
    height: '40%'
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
    messageContainer: {
      flexDirection: 'row',
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },
    message1: {
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'red',
      marginHorizontal: 10,
    },
    message2: {
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
      marginHorizontal: 10,
    },
});

export default LogoutModal;