import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../../components/common/Header';
import RecommendItem from '../../components/Recommend/RecommendItem'
import { TouchableOpacity } from 'react-native-gesture-handler';

export type RecommendParamList = {
  Recommend: undefined;
  MoreRecommend: undefined;
}

export type RecommendScreenNavigationProp = StackNavigationProp<
  RecommendParamList,
  'Recommend'
>

export type Props = {
  navigation: RecommendScreenNavigationProp;
};

type RecommendPill = {
  id: number;
  name: string;
  description: string;
}

const RecommendScreen:React.FC<Props> = ({navigation}) => {
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>('');
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);

  useEffect(() => {
    // 로그인 정보에서 나이랑 성별 가지고 오기
    setAge(20);
    setGender('남성');
    // 백이랑 연결해서 유저에게 추천하는 영양제 정보 가져오기
    setRecommendPills([
      {id: 1, name: 'pill1', description: '이 약은 어쩌구저쩌구~~~`'},
      {id: 2, name: 'pill2', description: '이 약은 어쩌구저쩌구~~~`'},
      {id: 3, name: 'pill3', description: '이 약은 어쩌구저쩌구~~~`'},
    ]);
  }, []);


  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.recommendText}>{age}대 {gender}에게 맞는 영양제 추천</Text>
        <View style={styles.recommendBox}>
          {recommendPills.map((recommendPill) => (
            <RecommendItem 
              key={recommendPill.id}
              id={recommendPill.id}
              name={recommendPill.name}
              description={recommendPill.description}
            />
          ))}
        </View>
        <TouchableOpacity 
        style={styles.recommendBtn}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('MoreRecommend')}
        >
          <Text style={styles.moreRecommendText}>더 많은 영양제 추천받기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 40,
  },
  recommendText: {
    fontSize: 15,
    color: 'black',
  },
  recommendBox: {
    height: '80%',
    marginTop: 10,
  },
  recommendBtn: {
    marginTop: 25,
    height: '25%',
    borderRadius: 8,
    backgroundColor: '#D3EBCD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreRecommendText: {
    color: 'black',
  }
});

export default RecommendScreen;
