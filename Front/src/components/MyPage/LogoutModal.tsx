import React from 'react';
import {StyleSheet, View, Modal} from 'react-native';

interface LogoutModalProps {

}

function LogoutModal({}: LogoutModalProps) {
  return (
    <View style={styles.container}>
        <Modal></Modal>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        zIndex:2,
        position: 'absolute',
        width: '40%',
        height: '30%'
    }
});

export default LogoutModal;