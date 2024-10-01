import React, {useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenModal } from '../../store/store';
import AlarmModalItems from './AlarmModalItems';
import { ScrollView } from 'react-native-gesture-handler';

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
  const scrollViewRef = useRef<ScrollView | null>(null);

  // 알람을 설정할 수 있는 모달을 닫는다
  const showAlarmModal = () => {
      dispatch(setOpenModal(!openModal));
      if (!openModal)  {
      };
    };
    
  return (
      <View style={styles.modalContainer}>
        <View style={styles.scrollViewBox}>
          <ScrollView style={styles.scrollViewContainer} ref={scrollViewRef}>
            <View style={styles.AllPillContainer}>
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
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={showAlarmModal}
      >
        <View style={styles.closeModalBtnContainer}>
          <Text style={styles.clseModalBtnText}>닫기</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 1,
    height: '100%',
  },
  scrollViewBox: {
    height: '80%',
    marginVertical: 10,

  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  AllPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 45,
    marginLeft: 30,

  },
  closeModalBtnContainer: {
    backgroundColor: '#F5F5F7',
    width: '100%',
    height: '23.4%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  clseModalBtnText: {
    fontSize: 15,
    color: 'black',
  }
});

export default AlarmModal;