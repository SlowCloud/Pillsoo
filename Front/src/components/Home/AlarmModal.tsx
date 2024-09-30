import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenModal } from '../../store/store';
import AlarmModalItems from './AlarmModalItems';

interface Supplement {
    supplementSeq: number;
    pillName: string;
    imageUrl: string;
  }

interface AlarmModalItemsProps {
  myKitData: Supplement[];
}

const AlarmModal:React.FC<AlarmModalItemsProps> = ({myKitData}) => {
  const dispatch = useDispatch();
  const openModal = useSelector((state: {openModal: boolean | null}) => state.openModal);

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
              pillName={item.pillName}
              supplementSeq={item.supplementSeq}
              imageUrl={item.imageUrl}
            />
          ))
        }
      </View>
  )
}

const styles = StyleSheet.create({
  
});

export default AlarmModal;