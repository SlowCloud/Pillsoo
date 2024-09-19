import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RecommendItemParamList } from '../../components/Recommend/RecommendItem';
import DetailInfo from '../../components/Detail/DetailInfo';
import DetailReview from '../../components/Detail/DetailReview';
import { CardStyleInterpolators } from '@react-navigation/stack';


type DetailScreenRouteProp = RouteProp<RecommendItemParamList, 'Detail'>;

export type PillData = {
  id: number;
  name: string;
  description: string;
  guide: string;
  functionality: string;
  image: string;
  isInWishlist: boolean;
}
// 영양제 id를 보내고
// 백한테서 영양제 정보가 오고 
// 상세페이지로 넘어왔음
const DetailScreen: React.FC = () => {
  // 어떤 페이지 보여줄지 결정
  const [selectedTab, setSelectedTab] = useState<'info' | 'review'>('info');
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
      // FUNCTIONALITY
      functionality: '이게 뭘까 나도 모름',
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
      <View style={styles.infoBox}>
        <Image 
          source={require('../../assets/pillIcon.png')}
          style={styles.image}
        ></Image>
        <TouchableOpacity
          style={styles.pillWish}
        >
          <Text>하트</Text>
        </TouchableOpacity>
        <Text style={styles.pillName}>{pillData.name}</Text>
      </View>
      <View style={styles.canSelectMenu}>
        <TouchableOpacity
        style={selectedTab === 'info' ? (
          styles.selectedTextBox
        ) : (
          styles.notSelectedTextBox
        )}
        onPress={() => setSelectedTab('info')}
        >
          <Text style={selectedTab === 'info' ? (
            styles.selectedText
          ) : (
            styles.notSelectedText
          )
        }>
            상세 정보
          </Text>
          <View style={selectedTab === 'info' ? styles.selectedCheck : null}></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedTab === 'review' ? (
            styles.selectedTextBox
          ) : (
            styles.notSelectedTextBox
          )}
          onPress={() => setSelectedTab('review')}
        >
          <Text style={selectedTab === 'review' ? (
            styles.selectedText
          ) : (
            styles.notSelectedText
          )
          }>리뷰</Text>
        <View style={selectedTab === 'review' ? styles.selectedCheck : null}></View>
        </TouchableOpacity>
      </View>
      <View style={styles.selectedContent}>
        {selectedTab === 'info' ? <DetailInfo pillData={pillData}/> : <DetailReview id={pillData.id}/>}
      </View>
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
    marginVertical: 45,
  },
  infoBox: {
    height: '20%',
    flexDirection: 'row',
  },
  image: {
    width: '40%',
    height: '80%',
    marginHorizontal: 15,
    marginTop: 10,
    resizeMode: 'contain',
  },
  pillWish: {
    width: '15%',
    height: '15%',
    marginTop: 80,
  },
  pillName: {
    fontSize: 27,
    color: 'black',
    marginTop: 40,
    marginLeft: 10,
  },
  canSelectMenu: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  selectedTextBox: {
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderColor: '#939185',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notSelectedTextBox: {
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderColor: '#939185',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 20,
    color: 'black'
  },
  notSelectedText: {
    fontSize: 20,
    color: '#939185',
  },
  selectedCheck: {
    width: 40,
    height: 10,
    marginTop: 11,
    backgroundColor: '#D3EBCD',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  selectedContent: {
    height: '65%',
    borderWidth: 1,
    borderColor: '#939185',
    borderBlockStartColor: '#F7F7F7'
    
  },
});

export default DetailScreen;
