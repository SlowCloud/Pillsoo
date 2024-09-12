import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';

const dummyData = [
  {
    id: 1,
    name: 'Product 1',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+1',
  },
  {
    id: 2,
    name: 'Product 2',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+2',
  },
  {
    id: 3,
    name: 'Product 3',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+3',
  },
  {
    id: 4,
    name: 'Product 4',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+4',
  },
  {
    id: 5,
    name: 'Product 5',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+5',
  },
  {
    id: 6,
    name: 'Product 6',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+6',
  },
  {
    id: 7,
    name: 'Product 7',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+7',
  },
  {
    id: 8,
    name: 'Product 8',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+8',
  },
  {
    id: 9,
    name: 'Product 9',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+9',
  },
  {
    id: 10,
    name: 'Product 10',
    image: 'https://via.placeholder.com/150',
    link: 'https://msearch.shopping.naver.com/search/all?query=Product+10',
  },
];

const WishListItem = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      {dummyData.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <Image source={{uri: item.image}} style={styles.image} />
            <Text>{item.name}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openLink(item.link)}>
              <Text style={styles.buttonText}>구매하러가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },

  textContainer: {
    alignItems: 'center',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    paddingBottom: 10,
  },

  image: {
    width: 100,
    height: 100,
  },

  button: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 15,
    width: 200,
  },

  buttonContainer: {
    marginLeft: 20,
  },

  buttonText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WishListItem;
