import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


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
  const navigation = useNavigation()
  const {inputText} = route.params;
  const [recommendations, setRecommendations] = useState<any[]>([]);
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
      console.log(inputText);
      try {
        const response = await axios.get(`${API_URL}/api/v1/recommend/survey`, {
          params: {client_text: inputText},
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('res', response);
        setRecommendations(response.data);
      } catch (err) {
        console.log('err', err);
      }
    };

    if (token) {
      fetchRecommendations();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>당신의 건강 상태: {inputText}</Text>
      <Text style={styles.recommendationTitle}>추천 영양제:</Text>
      {recommendations.map(item => (
        <View key={item.supplementSeq} style={styles.recommendationContainer}>
          <Text style={styles.recommendationText}>{item.pill_name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 20,
    margin: 10,
    color: 'black',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  recommendationContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'black',
  },
  recommendationImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  noImageText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default MoreRecommendResultScreen;
