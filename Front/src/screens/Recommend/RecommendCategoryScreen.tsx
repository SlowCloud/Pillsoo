import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecommendParamList} from './RecommendScreen';
import {API_URL} from '@env';

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

type RecommendPill = {
  id: number;
  imageUrl: string;
};

const RecommendCategoryScreen: React.FC<Props> = ({route, navigation}) => {
  const {category} = route.params;
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);

  useEffect(() => {
    CategorySupplements();
  }, [category]);

  const CategorySupplements = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(
        `${API_URL}/api/v1/supplement/effect/${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data;
      const pills = data.map((item: any) => ({
        id: item.supplementSeq,
        // imageUrl: item.image_url,
      }));

      setRecommendPills(pills);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePillPress = (id: number) => {
    navigation.navigate('Detail', {id});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category} 관련 영양제</Text>
      <FlatList
        data={recommendPills}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handlePillPress(item.id)}
            style={styles.pillItem}>
            {/* <Image source={{uri: item.imageUrl}} style={styles.image} /> */}
            <Text>{item.id}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pillItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default RecommendCategoryScreen;
