import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

type Props = {
    category: string;
}

const SelectPillItems: React.FC<Props> = ({ category }) => {
  return (
    <TouchableOpacity style={styles.pillNameBox}>
        <Text style={styles.pillNameText}>{category}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    pillNameBox: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#C8C6C6',
        marginVertical: 1,
        paddingBottom: 2,
    },
    pillNameText: {
      marginHorizontal: 2,
      color: 'black',
    }
});

export default SelectPillItems;