import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-gesture-handler';
import {API_URL} from '@env';
import CommonModal from '../common/Modal';
import Modal2 from '../common/Modal2';

type Props = {
  userName: string;
  content: string;
  supplementId: number;
  userSeq: number;
  reviewId: number;
  nickName: string;
  onUpdateReviews: () => void;
};

const DetailReviewItems: React.FC<Props> = ({
  userName,
  content,
  supplementId,
  userSeq,
  reviewId,
  nickName,
  onUpdateReviews,
}) => {
  const storedUserSeq = useSelector(
    (state: {userSeq: number | null}) => state.userSeq,
  );

  const [token, setToken] = useState<string | null>(null);
  const [updateContent, setUpdateContent] = useState<boolean>(false);
  const [updateReview, setUpdateReview] = useState<string>('');
  const [openModal, setOPenModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const handleUpdateTextChange = (inputText: string) => {
    setUpdateReview(inputText);
  };

  const clickedUpdateBtn = async () => {
    setOpenUpdateModal(true)
    setUpdateContent(false);
    setUpdateReview('');
    if (!token) return;

    try {
      await axios.patch(
        `${API_URL}/api/v1/supplement/${supplementId}/reviews`,
        {reviewSeq: reviewId, content: updateReview},
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      onUpdateReviews(); // 수정 성공 후 리뷰 목록 새로고침
    } catch (error) {
      console.log(error);
      Alert.alert('리뷰 수정 실패', '리뷰 수정에 실패했습니다.');
    }
  };

  const confirmDelete = () => {
    setOPenModal(true);
  };

  const handleDelete = async () => {
    if (!token) return;

    try {
      await axios.delete(
        `${API_URL}/api/v1/supplement/${supplementId}/reviews`,
        {
          headers: {
            access: `${token}`,
          },
        },
      );
      onUpdateReviews(); // 삭제 성공 후 리뷰 목록 새로고침
    } catch (error) {
      console.log(error);
      Alert.alert('리뷰 삭제 실패', '리뷰 삭제에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setOpenUpdateModal(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewNickname}>📣 {nickName}</Text>
        {storedUserSeq === userSeq && !updateContent && (
          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => setUpdateContent(true)}>
              <Text>수정</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity onPress={confirmDelete}>
              <Text>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {updateContent ? (
        <View>
          <TextInput
            value={updateReview}
            placeholder={content}
            autoCorrect={false}
            multiline
            onChangeText={handleUpdateTextChange}
          />
          <TouchableOpacity onPress={clickedUpdateBtn}>
            <Text>수정 완료</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.reviewContent}>{content}</Text>
      )}
      <View style={styles.line}></View>
      <CommonModal
        visible={openUpdateModal}
        message='리뷰가 수정되었습니다!'
        onClose={handleCloseModal}
        imageSource={require('../../assets/review.png')}
      />
      <Modal2 
        isVisible={openModal}
        onClose={() => setOPenModal(false)}
        onConfirm={handleDelete}
        title='정말로 삭제하시겠습니까?'
        subText='리뷰가 완전히 삭제됩니다.'
        confirmText='삭제'
        cancelText='취소'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '100%',
    height: '20%',
    // borderWidth: 1,
  },
  reviewContainer: {
    flexDirection: 'row',
  },
  reviewNickname: {
    color: 'black',
  },
  reviewContent: {
    color: 'black',
    fontSize: 15,
    marginTop: 1,
    marginLeft: 20,
  },
  line: {
    width: '100%',
    height: 0.45,
    backgroundColor: '#DFDFDE',
    marginTop: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    marginLeft: 7,
  },
});

export default DetailReviewItems;
