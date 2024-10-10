import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { OCR_API_KEY, API_URL, TOKEN } from '@env';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal2 from '../../components/common/Modal2';
import { Alert } from 'react-native';

const OCRScreen = () => {
  const [ocrTexts, setOcrTexts] = useState<string[]>([]);
  const [editableText, setEditableText] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [supplementLoading, setSupplementLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedSupplementSeq, setSelectedSupplementSeq] = useState<number | null>(null);
  const navigation = useNavigation();
  const isTokenLoaded = !!TOKEN;

  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem('jwt_token');
    setToken(storedToken);
  };

  useEffect(() => {
    const setup = async () => {
      await fetchToken();
      if (TOKEN) {
        requestCameraPermission();
      }
    };
    setup();
  }, []);
  

  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === 'granted') {
        handleCapture();
      } else {
        Alert.alert('권한 필요', '카메라 사용을 위해 권한이 필요합니다.');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const handleCapture = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.assets && result.assets.length > 0) {
        const base64Image = result.assets[0].base64;
        if (base64Image) {
          await sendToOcr(base64Image);
        }
      }
    } catch (error) {
      console.error('Error in handleCapture:', error);
    }
  };

  const sendToOcr = async (base64Image: string) => {
    if (!isTokenLoaded) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate',
        {
          requests: [
            {
              features: [{ type: 'TEXT_DETECTION' }],
              image: { content: base64Image },
            },
          ],
        },
        {
          headers: {
            'x-goog-user-project': 'ocr-p-436200',
            'Content-Type': 'application/json',
            key: OCR_API_KEY,
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const detectedTexts = response.data.responses[0]?.textAnnotations?.map(
        item => item.description,
      );

      if (detectedTexts) {
        setOcrTexts(detectedTexts.slice(1));
      }
      console.log(detectedTexts);
    } catch (error) {
      console.error('OCR API request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setOcrTexts([]);
    setEditableText('');
    setSelectedIndex(null);
    setShowResults(false);
    handleCapture();
  };

  const handleEditText = (index: number) => {
    setEditableText(ocrTexts[index]);
    setSelectedIndex(index);
    setShowResults(true);
  };

  const handleSaveEdit = async () => {
    if (selectedIndex !== null) {
      const updatedTexts = [...ocrTexts];
      updatedTexts[selectedIndex] = editableText;
      setOcrTexts(updatedTexts);
      setSelectedIndex(null);
      setEditableText('');

      await sendSavedTextToApi(editableText);
    }
  };

  const sendSavedTextToApi = async (text: string) => {
    if (!isTokenLoaded) return;

    setSupplementLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/supplement/search`, {
        headers: {
          access: `${token}`,
        },
        params: {
          searchtext: text,
          functionality: '',
          page: 0,
          size: 10,
        },
      });

      if (response.status === 200) {
        setResults(response.data.content);
      }
    } catch (error) {
      console.error('API request error:', error);
    } finally {
      setSupplementLoading(false);
    }
  };

  const handleAddSupplement = (supplementSeq: number) => {
    setSelectedSupplementSeq(supplementSeq);
    setIsModalVisible(true);
  };

  const confirmAddSupplement = async () => {
    if (selectedSupplementSeq !== null) {
      await addSupplement(selectedSupplementSeq);
      setIsModalVisible(false);
      navigation.navigate('SupplementInput');
    }
  };

  const addSupplement = async (supplementSeq: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/cabinet`,
        {
          supplementSeq,
        },
        {
          headers: {
            access: `${token}`,
          },
        },
      );

      if (response.status === 200) {
        console.log('Supplement added successfully');
      }
    } catch (error) {
      console.error('Error adding supplement:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>스캔한 영양제의 이름을 선택해주세요!</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text>텍스트 인식 중...</Text>
        </View>
      ) : ocrTexts.length > 0 ? (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {ocrTexts.map((text, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEditText(index)}
              style={[
                styles.resultText,
                selectedIndex === index && styles.selectedText,
              ]}>
              <Text>{text}</Text>
            </TouchableOpacity>
          ))}

          {showResults && (
            <>
              <Text style={styles.editPrompt}>
                영양제 이름에 맞게 수정해주세요 !
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={editableText}
                  onChangeText={setEditableText}
                  multiline
                  editable={selectedIndex !== null}
                />
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  style={styles.saveButton}>
                  <Text style={styles.saveText}>검색하기</Text>
                </TouchableOpacity>
              </View>

              {supplementLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00ff00" />
                  <Text>영양제 검색중...</Text>
                </View>
              ) : results.length > 0 ? (
                <View style={styles.supplementContainer}>
                  <Text style={styles.supplementHeader}>
                    찾는 영양제를 선택해주세요 !
                  </Text>
                  {results.map(item => (
                    <TouchableOpacity
                      key={item.supplementSeq}
                      style={styles.supplementCard}
                      onPress={() => handleAddSupplement(item.supplementSeq)}>
                      <Text style={styles.supplementName}>{item.pillName}</Text>
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.supplementImage}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  검색하신 영양제가 존재하지 않습니다.
                </Text>
              )}
              <TouchableOpacity onPress={handleRetake} style={styles.retakeButton}>
                <Text style={styles.retakeText}>다시 찍기</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>스캔된 텍스트가 없습니다.</Text>
      )}

      <Modal2
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmAddSupplement}
        title="이 영양제를 마이 키트에"
        subText="추가하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#00000020',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    paddingBottom: 20,
  },
  resultText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedText: {
    backgroundColor: '#00FF00',
  },
  editPrompt: {
    marginTop: 20,
    textAlign: 'center',
    color: '#495057',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: '#00000010',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#adb5bd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#495057',
  },
  saveButton: {
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retakeButton: {
    marginTop: 10,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  retakeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#868e96',
    fontWeight: 'bold',
  },
  supplementContainer: {
    marginTop: 20,
  },
  supplementHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#343a40',
    textShadowColor: '#00000020',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  supplementCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  supplementName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
  },
  supplementImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default OCRScreen;
