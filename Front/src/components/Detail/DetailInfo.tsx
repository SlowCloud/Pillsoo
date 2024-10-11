import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PillData} from '../../screens/Detail/DetailScreen';

export type DetailInfoProps = {
  pillData: PillData;
};

const DetailInfo: React.FC<DetailInfoProps> = ({pillData}) => {
  return (
    <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTextTitle}>💊 효능</Text>
      <ScrollView>   
          <Text style={styles.contentText}>{pillData.functionality}</Text>
      </ScrollView>
        </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentTextTitle}>💊 주의할 점</Text>
        <ScrollView>
          <Text style={styles.contentText}>{pillData.doseGuide}</Text>
        </ScrollView>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentTextTitle}>💊 유통기한</Text>
        <ScrollView>
          <Text style={styles.contentText}>{pillData.expirationDate}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    gap: 30,
  },
  contentContainer: {
    width: '90%',
    height: '25%',
  },
  contentTextTitle: {
    color: 'black',
    marginBottom: 12,
  },
  contentText: {
    color: 'black',
  },
});

export default DetailInfo;
