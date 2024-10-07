import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal2 from '../../components/common/Modal2';

interface WishListItemProps {
  pillName: string;
  imageUrl: string;
  supplementSeq: number;
  userSeq: number;
  onRemove: (supplementSeq: number) => void;
}

const WishListItem: React.FC<WishListItemProps> = ({
  pillName,
  imageUrl,
  supplementSeq,
  userSeq,
  onRemove,
}) => {
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

  const handlePurchasePress = (pillName: string) => {
    const query = encodeURIComponent(pillName.trim());
    const url = `https://msearch.shopping.naver.com/search/all?query=${query}`;
    Linking.openURL(url);
  };

  const handleRemovePress = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        await axios.delete(`${API_URL}/api/v1/wishlist`, {
          headers: {
            access: `${token}`,
          },
          params: {
            userSeq,
            supplementSeq,
          },
        });

        setIsRemoveModalVisible(false);
        onRemove(supplementSeq);
      }
    } catch (error) {
      console.error('위시리스트에서 제거하는 중 오류 발생:', error);
      setIsRemoveModalVisible(false);
    }
  };

  const openRemoveModal = () => {
    setIsRemoveModalVisible(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.pillName} numberOfLines={1} ellipsizeMode="tail">
          {pillName}
        </Text>
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchasePress(pillName)}>
          <Text style={styles.purchaseButtonText}>구매하러가기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={openRemoveModal}>
        <Image
          source={require('../../assets/heart1.png')}
          style={styles.removeImage}
        />
      </TouchableOpacity>

      <Modal2
        isVisible={isRemoveModalVisible}
        onClose={closeRemoveModal}
        onConfirm={handleRemovePress}
        title="정말 제거하시겠습니까?"
        subText="위시리스트에서 제거됩니다!"
        confirmText="삭제"
        cancelText="취소"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
  },
  textContainer: {
    flex: 1,
  },
  pillName: {
    fontSize: 14,
    fontWeight: 'bold',
    top: 10,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  purchaseButton: {
    backgroundColor: '#7bf898',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  removeImage: {
    width: 20,
    height: 20,
  },
});

export default WishListItem;
