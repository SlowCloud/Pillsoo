import React from 'react';
import {StyleSheet, View, Text, Modal, TouchableOpacity, FlatList, Image} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import { setOpenModal } from '../../store/store';
import AlarmModalItems from './AlarmModalItems';

interface Supplement {
    supplementSeq: number;
    pillName: string;
    functionality: string;
    imageUrl: string;
  }

  interface AlarmModalProps {
    myKitData: Supplement[];
  }

const AlarmModal: React.FC<AlarmModalProps> = ({myKitData}) => {
    const openModal = useSelector((state: {openModal: boolean | null}) => state.openModal);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // 알람을 설정할 수 있는 모달을 닫는다
    const showAlarmModal = () => {
        dispatch(setOpenModal(!openModal));
        if (!openModal)  {
        };
    };
    
  return (
      <View>
        <TouchableOpacity
          onPress={showAlarmModal}
        >
          <Text>닫아!!!!!!</Text>
        </TouchableOpacity>
        {myKitData.map(item => (
          <AlarmModalItems
            key={item.supplementSeq}
            functionality={item.functionality}
            pillName={item.pillName}
            supplementSeq={item.supplementSeq}
            imageUrl={item.imageUrl}
          />
        ))}
      </View>
  )
}

const styles = StyleSheet.create({
});

export default AlarmModal;