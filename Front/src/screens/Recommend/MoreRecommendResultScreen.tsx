import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator, // 로딩 인디케이터 추가
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

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
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 변수
  const nickname = useSelector(
    (state: {nickname: string | null}) => state.nickname,
  );

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
        setLoading(true); // 데이터 로드 시작
        const response = await axios.get(`${API_URL}/api/v1/recommend/survey`, {
          params: {client_text: inputText},
          headers: {
            access: `${token}`,
          },
        });
        setRecommendations(response.data);
      } catch (err) {
        // console.log(err);
      } finally {
        setLoading(false); // 데이터 로드 완료
      }
    };

    if (token) {
      fetchRecommendations();
    }
  }, [inputText, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF00" />
        {/* 로딩 인디케이터 */}
        <Text style={styles.loadingText}>추천 영양제를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {`${nickname}님의 건강상태와 관련된 영양제 \n추천입니다 !`}
      </Text>
      {/* <Text style={styles.resultText}>당신의 건강 상태: {inputText}</Text> */}
      <Text style={styles.recommendationTitle}>추천 영양제:</Text>
      {recommendations.length === 0 ? ( // 추천 영양제가 없는 경우 메시지 표시
        <Text style={styles.noRecommendationsText}>
          건강상태와 관련된 영양제가 없습니다.
        </Text>
      ) : (
            recommendations.map(item => (
              <TouchableOpacity
                key={item.supplementSeq}
                onPress={() =>
                  navigation.navigate('Detail', {id: item.supplementSeq})
                }>
                <View 
                  style={styles.recommendationContainer}
                >
                  <Image source={{uri: item.image_url}} style={styles.image} />
                  <Text style={styles.pillName}>{item.pill_name}</Text>
                </View>
              </TouchableOpacity>
            ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 20,
    color: 'black',
  },
  resultText: {
    fontSize: 20,
    color: 'black',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  noRecommendationsText: {
    fontSize: 16,
    color: 'gray',
  },
  recommendationContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 30,
    marginVertical: 15,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  pillName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  image: {
    width: 100,
    height: 100,
    // marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    // marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default MoreRecommendResultScreen;
