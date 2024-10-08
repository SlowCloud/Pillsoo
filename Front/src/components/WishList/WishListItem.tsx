import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';

interface WishListItemProps {
  pillName: string;
  imageUrl: string;
}

const WishListItem: React.FC<WishListItemProps> = ({pillName, imageUrl}) => {
  const handlePurchasePress = (pillName: string) => {
    const query = encodeURIComponent(pillName.trim());
    const url = `https://msearch.shopping.naver.com/search/all?query=${query}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.pillName} numberOfLines={1} ellipsizeMode="tail">
          {pillName}
        </Text>
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchasePress(pillName)}>
          <Text style={styles.purchaseButtonText}>구매하러가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textContainer: {
    flex: 1,
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  purchaseButton: {
    backgroundColor: '#a4f870',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WishListItem;
