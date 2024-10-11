import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';

type Props = {
  content: string;
  userNickname: string;
  supplementSeq: number;
  token: string | null;
};

interface PillInfo {
  pillName: string;
  imageUrl: string;
}

const MyPageReviewItems: React.FC<Props> = ({
  content,
  userNickname,
  supplementSeq,
  token,
}) => {
  const [pillData, setPillData] = useState<PillInfo | null>(null);

  useEffect(() => {
    const fetchMyReview = async () => {
      if (!token) {
        console.log('마이페이지에서 영양제 상세 정보 가져오고 싶은데 토큰이 없다.');
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/v1/supplement/${supplementSeq}`,
          {
            headers: {
              access: `${token}`,
            },
            params: {
              supplementSeq: supplementSeq,
            },
          },
        );
        setPillData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMyReview();
  }, [supplementSeq, token]);

  return (
    <View style={styles.container}>
      <Image
        source={
          pillData?.imageUrl
            ? { uri: pillData.imageUrl }
            : require('../../assets/noImage.png') 
        }
        style={styles.myReviewImage}
      />
      <View style={styles.myReviewBox}>
        <Text numberOfLines={1} ellipsizeMode="tail">
          💊{pillData?.pillName || '영양제 이름 없음'}
        </Text>
        <Text
          style={styles.myReviewContent}
          numberOfLines={1}
          ellipsizeMode="tail">
          {content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
    height: 80,
    backgroundColor: '#ffff',
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
    maxWidth: '80%',
  },
  pillName: {
    marginTop: 5,
    color: 'black',
  },
});

export default MyPageReviewItems;
