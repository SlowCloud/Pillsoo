import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

type Props = {
  content: string;
  name: string;
  imageUrl: string;
}

const MyPageReviewItems: React.FC<Props> = ({ content, name, imageUrl }) => {
  return (
    <View style={styles.container}>
      <Image
      source={require("../../assets/profile/5.png")}
      style={styles.myReviewImage}
      />
      <View style={styles.myReviewBox}>
        <Text>💊{name}</Text>
        <Text style={styles.myReviewContent}>{content}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
    height: 80,
    backgroundColor: '#D3EBCD',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  myReviewImage: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  myReviewContent: {
    marginTop: 5,
    marginLeft: 10,
    color: 'black',
  },
  myReviewBox: {
    marginLeft: 10,
  }
});

export default MyPageReviewItems;