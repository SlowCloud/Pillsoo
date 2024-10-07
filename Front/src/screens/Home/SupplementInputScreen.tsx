import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import Modal2 from '../../components/common/Modal2';

interface Supplement {
  supplementSeq: number;
  pillName: string;
  functionality: string;
  imageUrl: string;
}

const SupplementInputScreen = () => {
  const navigation = useNavigation();
  const [myKitData, setMyKitData] = useState<Supplement[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // 삭제 성공 모달 상태
  const [selectedSupplementSeq, setSelectedSupplementSeq] = useState<
    number | null
  >(null);

  const userSeq = useSelector(
    (state: {userSeq: string | null}) => state.userSeq,
  );

  const fetchMyKitData = async () => {
    const token = await AsyncStorage.getItem('jwt_token');

    try {
      const response = await axios.get(`${API_URL}/api/v1/cabinet`, {
        headers: {
          access: `${token}`,
        },
        params: {
          userSeq,
        },
      });

      setMyKitData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSupplement = async () => {
    const token = await AsyncStorage.getItem('jwt_token');

    try {
      if (selectedSupplementSeq !== null) {
        await axios.delete(`${API_URL}/api/v1/cabinet`, {
          headers: {
            access: `${token}`,
          },
          params: {
            userSeq,
            supplementSeq: selectedSupplementSeq,
          },
        });

        setMyKitData(
          myKitData.filter(
            item => item.supplementSeq !== selectedSupplementSeq,
          ),
        );
        setIsModalVisible(false);
        setIsSuccessModalVisible(true); // 삭제 성공 모달을 보이게 설정
      }
    } catch (err) {
      Alert.alert('알람 설정을 먼저 해제해주세요 !');
      console.log(err);
      setIsModalVisible(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMyKitData();
    }, []),
  );

  const openDeleteModal = (supplementSeq: number) => {
    setSelectedSupplementSeq(supplementSeq);
    setIsModalVisible(true);
  };

  const renderItem = ({item}: {item: Supplement}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemDetailContainer}
        onPress={() => navigation.navigate('Detail', {id: item.supplementSeq})} // Detail 페이지로 이동
      >
        <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.pillName}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => openDeleteModal(item.supplementSeq)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>마이 키트</Text>

        {myKitData.length === 0 ? (
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>
              마이키트에 담은 영양제가 없습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            data={myKitData}
            renderItem={renderItem}
            keyExtractor={item => item.supplementSeq.toString()}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'OCR',
            } as {screen: string})
          }>
          <Text style={styles.scanText}>스캔해서 입력하기</Text>
        </TouchableOpacity>
      </View>

      <Modal2
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={deleteSupplement}
        title="정말로 삭제하시겠습니까?"
        subText="마이키트에서 완전히 제거 됩니다 !"
        confirmText="삭제"
        cancelText="취소"
      />

      <Modal2
        isVisible={isSuccessModalVisible} // 삭제 성공 모달
        onClose={() => setIsSuccessModalVisible(false)} // 모달을 닫는 onClose 핸들러
        onConfirm={() => setIsSuccessModalVisible(false)} // 확인 버튼 누르면 모달 닫기
        title="성공적으로 삭제되었습니다!"
        subText="마이키트에서 제거 되었습니다 !"
        confirmText="확인"
        cancelText="취소"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  itemDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '60%',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  scanText: {
    fontSize: 16,
    color: 'black',
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default SupplementInputScreen;
