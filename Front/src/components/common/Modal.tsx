import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface CommonModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  imageSource?: any;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  message,
  onClose,
  imageSource,
}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FastImage source={imageSource} style={styles.image} />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButtonContainer}>
            <Text style={styles.closeButton}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButtonContainer: {
    backgroundColor: '#00FF00',
    marginTop: 15,
    width: 240,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 18,
    fontWeight : 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default CommonModal;
