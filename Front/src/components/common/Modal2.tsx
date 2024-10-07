import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';

interface CustomModalProps {
  isVisible: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  subText?: string;
  confirmText?: string;
  cancelText?: string;
}

const Modal2: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  subText,
  confirmText,
  cancelText,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{title}</Text>
          <Text style={styles.modalSubText}>{subText}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={onConfirm}>
              <Text style={styles.modalDeleteButtonText}>{confirmText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}>
              <Text style={styles.modalCancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  modalSubText: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalDeleteButton: {
    backgroundColor: '#a4f87b',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Modal2;
