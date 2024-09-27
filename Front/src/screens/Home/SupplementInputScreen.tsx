import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';

interface Supplement {
  supplementSeq: number;
  pillName: string;
  functionality: string;
  imageUrl: string;
}

const SupplementInputScreen = () => {
  const navigation = useNavigation();
  const [myKitData, setMyKitData] = useState<Supplement[]>([]);
  const userSeq = useSelector(
    (state: {userSeq: string | null}) => state.userSeq,
  );

  useEffect(() => {
    const fetchMyKitData = async () => {
      const token = await AsyncStorage.getItem('jwt_token');

      try {
        const response = await axios.get(`${API_URL}/api/v1/cabinet`, {
          headers: {
            access: `${token}`,
          },
          params: {
            userSeq,
          },
        });

        setMyKitData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyKitData();
  }, []);

  const renderItem = ({item}: {item: Supplement}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Detail', {id: item.supplementSeq})}>
      <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
      <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
        {item.pillName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>마이 키트</Text>
        <FlatList
          data={myKitData}
          renderItem={renderItem}
          keyExtractor={item => item.supplementSeq.toString()}
        />
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'OCR',
            } as {screen: string})
          }>
          <Text style={styles.scanText}>스캔해서 입력하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  scanText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SupplementInputScreen;
