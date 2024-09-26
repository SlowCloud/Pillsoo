import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

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

const MyPageReviewItems: React.FC<Props> = ({ content, userNickname, supplementSeq, token }) => {
  const [pillData, setPillData] = useState<PillInfo | null>(null); 

  useEffect(() => {
    const fetchMyReview = async () => {
      if (!token) {
        console.log("마이페이지에서 영양제 상세 정보 가져오고 싶은데 토큰이 없다.");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/v1/supplement/${supplementSeq}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            supplementSeq: supplementSeq,
          },
        });
        setPillData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyReview();
  }, [supplementSeq, token]); // dependency array에 token과 supplementSeq 추가

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: pillData?.imageUrl }}
        style={styles.myReviewImage}
      />
      <View style={styles.myReviewBox}>
        <Text>💊{pillData?.pillName}</Text>
        <Text style={styles.myReviewContent}>{content}</Text>
      </View>
    </View>
  );
};

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
  },
  pillName: {
    marginTop: 5,
    color: 'black',
  },
});

export default MyPageReviewItems;
