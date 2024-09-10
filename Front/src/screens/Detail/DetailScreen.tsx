import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RecommendItemParamList } from '../../components/Recommend/RecommendItem';

type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

export type PillData = {
  id: number;
  name: string;
  description: string;
  guide: string;
  image: string;
  isInWishlist: boolean;
}
// 영양제 id를 보내고
// 백한테서 영양제 정보가 오고 
// 상세페이지로 넘어왔음
const DetailScreen: React.FC = () => {
  const [pillData, setPillData] = useState<PillData | null>(null)
  const route = useRoute<DetailScreenRouteProp>();
  const { id } = route.params;

  useEffect(() => {
    // 이건 임의 데이터 나중에 바꾸셈
    // response에서 어떻게 받는지 확인
    const response = {
      id: 1, 
      name: 'pill1', 
      description: '이 약은 어디에 효과가 있고~~', 
      guide: '이 약은 ~~에 주의하고~~', 
      image: '이미지 주소', 
      isInWishlist: false
    }
    setPillData(response)
  }, [])

  if (!pillData) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Image source={require('../../assets/pillIcon.png')}></Image>
      <Text>{pillData.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  container: {
    flex: 1,
  },
});

export default DetailScreen;
