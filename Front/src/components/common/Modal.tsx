import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

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
          <Image source={imageSource} style={styles.image} />
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
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  closeButtonContainer: {
    backgroundColor: '#7bf898',
    marginTop: 15,
    width: 240,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default CommonModal;
