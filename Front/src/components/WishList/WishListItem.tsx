import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

interface WishListItemProps {
  pillName: string;
  imageUrl: string;
}

const WishListItem: React.FC<WishListItemProps> = ({pillName, imageUrl}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />
      <Text style={styles.pillName}>{pillName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
});

export default WishListItem;
