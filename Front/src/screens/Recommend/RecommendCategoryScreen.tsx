import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecommendParamList } from './RecommendScreen';

type RecommendCategoryScreenNavigationProp = StackNavigationProp<
    RecommendParamList,
    'RecommendCategory'
>;

type RecommendCategoryScreenRouteProp = RouteProp<
    RecommendParamList,
    'RecommendCategory'
>;

type Props = {
    navigation: RecommendCategoryScreenNavigationProp;
    route: RecommendCategoryScreenRouteProp;
};

const RecommendCategoryScreen: React.FC<Props> = ({ route }) => {
    const { category } = route.params;
  return (
    <View>
        <Text>{category}</Text>
    </View>
  )
}

const styles = StyleSheet.create({});

export default RecommendCategoryScreen;