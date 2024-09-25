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
  pillName: string;
};

const RecommendCategoryScreen: React.FC<Props> = ({route, navigation}) => {
  const {category} = route.params;
  const [recommendPills, setRecommendPills] = useState<RecommendPill[]>([]);

  useEffect(() => {
    const fetchSupplements = async () => {
      await CategorySupplements();
    };

    fetchSupplements();
  }, []);

  const CategorySupplements = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(
        `${API_URL}/api/v1/supplement/effect/${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            functionality: '',
            page: 1,
            size: 10,
          },
        },
      );
      const data = response.data.content;
      console.log(data);
      const pills = await Promise.all(
        data.map(async (item: any) => {
          const pillId = item.supplementSeq;
          const {imageUrl, pillName} = await ImageSupplements(pillId);
          return {
            id: pillId,
            imageUrl,
            pillName,
          };
        }),
      );
      setRecommendPills(pills);
    } catch (error) {
      console.log(error);
    }
  };

  const ImageSupplements = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(`${API_URL}/api/v1/supplement/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        imageUrl: response.data.imageUrl,
        pillName: response.data.pillName,
      };
    } catch (error) {
      console.log(error);
      return {imageUrl: '', pillName: ''};
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
            <Image source={{uri: item.imageUrl}} style={styles.image} />
            <Text>{item.pillName}</Text>
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
