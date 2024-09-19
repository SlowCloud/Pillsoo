import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export type RecommendItemParamList = {
  RecommendItem: undefined;
  Detail: { id: number};
}

export type RecommendItemScreenNavigationProp = StackNavigationProp<
  RecommendItemParamList,
  'RecommendItem'
>

type Props = {
  id: number;
  imageUrl: any;
}

const RecommendItem: React.FC<Props> = ({ id, imageUrl }) => {
  const navigation = useNavigation<RecommendItemScreenNavigationProp>();

  // 클릭하면 백한테 영양제 id 보내서
  // 상세페이지로 넘어가기
  const goDetail = () => {
    navigation.navigate('Detail', {id})
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={goDetail}
    >
      <View>
      <Image 
        // source={require('../../assets/profile/3.png')}
        // Props로 받은 이미지 주소가 안 맞음
        // 파일 존재X
        source={imageUrl}
        style={styles.pillImage}
      />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillImage: {
    width: 100,
    height: 100,
  }
});

export default RecommendItem;
