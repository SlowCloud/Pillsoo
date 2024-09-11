import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

type Props = {
    name: string;
    content: string;
}

const DetailReviewItems: React.FC<Props> = ({ name, content }) => {
  return (
    <View style={styles.container}>
        <Text>📣{name}</Text>
        <Text style={styles.reviewContent}>{content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    reviewContent: {
        color: 'black',
        fontSize: 15,
        marginTop: 1,
    }
});

export default DetailReviewItems;