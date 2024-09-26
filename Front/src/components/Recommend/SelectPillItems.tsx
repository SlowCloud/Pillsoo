import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {RecommendParamList} from '../../screens/Recommend/RecommendScreen';
import {RecommendScreenNavigationProp} from '../../screens/Recommend/RecommendScreen';

type Props = {
  category: string;
  navigation: RecommendScreenNavigationProp;
};

const SelectPillItems: React.FC<Props> = ({category, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.pillNameBox}
      onPress={() => navigation.navigate('RecommendCategory', {category})}>
      <Text style={styles.pillNameText}>{category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pillNameBox: {
    backgroundColor: '#E9F5E9',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 7,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pillNameText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});

export default SelectPillItems;
