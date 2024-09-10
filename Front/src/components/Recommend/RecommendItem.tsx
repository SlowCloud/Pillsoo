import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Props = {
  id: number;
  name: string;
  description: string;
}

const RecommendItem: React.FC<Props> = ({ id, name, description }) => {
  return (
    <View style={styles.container}>
      <View>
      <Text>{id}</Text>
      <Text>{name}</Text>
      </View>
      <Text style={styles.pillDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillDescription: {
    marginLeft: 20,
  }
});

export default RecommendItem;
