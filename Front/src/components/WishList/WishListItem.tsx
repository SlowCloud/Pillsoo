import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WishListItemProps {
  userSeq: number;
  supplementSeq: number;
  pillName: string;
  functionality: string;
}

const WishListItem: React.FC<WishListItemProps> = ({ userSeq, supplementSeq, pillName, functionality }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pillName}>{pillName}</Text>
      <Text style={styles.functionality}>효능: {functionality}</Text>
      <Text>사용자 시퀀스: {userSeq}</Text>
      <Text>보충제 시퀀스: {supplementSeq}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  functionality: {
    color: '#666',
  },
});

export default WishListItem;
