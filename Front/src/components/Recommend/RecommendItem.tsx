import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export type RecommendItemParamList = {
  RecommendItem: undefined;
  Detail: { id: number;};
}

export type RecommendItemScreenNavigationProp = StackNavigationProp<
  RecommendItemParamList,
  'RecommendItem'
>

type Props = {
  id: number;
  name: string;
  description: string;
}

const RecommendItem: React.FC<Props> = ({ id, name, description }) => {
  const navigation = useNavigation<RecommendItemScreenNavigationProp>();

  // 클릭하면 백한테 영양제 id 보내서
  // 상세페이지로 넘어가기
  const goDetail = () => {
    navigation.navigate('Detail', {id})
  }

  return (
    <TouchableOpacity style={styles.container}
      onPress={goDetail}
    >
      <View>
      <Text>{id}</Text>
      <Text>{name}</Text>
      </View>
      <Text style={styles.pillDescription}>{description}</Text>
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
  pillDescription: {
    marginLeft: 20,
  }
});

export default RecommendItem;
