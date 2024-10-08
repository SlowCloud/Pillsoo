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
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubText}>{subText}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={onConfirm}>
              <Text style={styles.modalButtonText}>{confirmText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}>
              <Text style={styles.modalButtonText2}>{cancelText}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalDeleteButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  modalButtonText2: {
    // fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
});

export default Modal2;
