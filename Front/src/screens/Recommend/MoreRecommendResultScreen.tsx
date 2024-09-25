import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

type Supplement = {
  functionality: string;
  image_url: string;
  pill_name: string;
  supplementSeq: number;
};

type MoreRecommendResultProps = {
  route: {
    params: {
      inputText: string;
    };
  };
};

const MoreRecommendResultScreen: React.FC<MoreRecommendResultProps> = ({
  route,
}) => {
  const navigation = useNavigation();
  const {inputText} = route.params;
  const [recommendations, setRecommendations] = useState<Supplement[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/recommend/survey`, {
          params: {client_text: inputText},
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecommendations(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchRecommendations();
    }
  }, [inputText, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.resultText}>당신의 건강 상태: {inputText}</Text>
      <Text style={styles.recommendationTitle}>추천 영양제:</Text>
      {recommendations.map(item => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Detail', {id: item.supplementSeq})
          }>
          <View key={item.supplementSeq} style={styles.recommendationContainer}>
            <Image source={{uri: item.image_url}} style={styles.image} />
            <Text style={styles.pillName}>{item.pill_name}</Text>
            <Text>{item.functionality}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  resultText: {
    fontSize: 20,
    marginVertical: 10,
    color: 'black',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  recommendationContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  pillName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: 'black',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default MoreRecommendResultScreen;
