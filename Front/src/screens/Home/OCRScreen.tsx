import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import {OCR_API_KEY, API_URL, TOKEN} from '@env';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const OCRScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [ocrTexts, setOcrTexts] = useState<string[]>([]);
  const [editableText, setEditableText] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      handleCapture();
    }, []),
  );

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleCapture = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.didCancel) {
      console.log('Camera closed');
      return;
    }

    if (result.errorCode) {
      console.log(result.errorMessage);
      return;
    }

    const base64Image = result.assets[0].base64;
    await sendToOcr(base64Image);
  };

  const sendToOcr = async (base64Image: string) => {
    try {
      const response = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate',
        {
          requests: [
            {
              features: [{type: 'TEXT_DETECTION'}],
              image: {content: base64Image},
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

      const detectedTexts = response.data.responses[0].textAnnotations.map(
        item => item.description,
      );
      setOcrTexts(detectedTexts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRetake = () => {
    setOcrTexts([]);
    setEditableText('');
    setSelectedIndex(null);
    handleCapture();
  };

  const handleEditText = (index: number) => {
    setEditableText(ocrTexts[index]);
    setSelectedIndex(index);
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
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/supplement/search`, {
        headers: {
          access: `${token}`,
        },
        params: {
          searchtext: text,
          functionality: '',
          page: 1,
          size: 10,
        },
      });

      if (response.status === 200) {
        setResults(response.data.content);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplement = (supplementSeq: number) => {
    Alert.alert('확인', '이 영양제를 마이 키트에 추가하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          await addSupplement(supplementSeq);
          navigation.navigate('SupplementInput');
        },
      },
    ]);
  };

  const addSupplement = async (supplementSeq: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/my-kit`,
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
        console.log('복용 영양제 투입');
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>복용하시는 영양제에 맞는 텍스트를 선택해주세요!</Text>
      {ocrTexts.length > 0 ? (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {ocrTexts.map((text, index) => (
            <TouchableOpacity key={index} onPress={() => handleEditText(index)}>
              <Text style={styles.resultText}>{text}</Text>
            </TouchableOpacity>
          ))}
          <TextInput
            style={styles.textInput}
            value={editableText}
            onChangeText={setEditableText}
            multiline
            editable={selectedIndex !== null}
          />
          <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
            <Text style={styles.saveText}>저장하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRetake} style={styles.retakeButton}>
            <Text style={styles.retakeText}>다시 스캔하기</Text>
          </TouchableOpacity>
          {loading && <Text>Sending...</Text>}

          {results.length > 0 && (
            <View style={styles.supplementContainer}>
              <Text style={styles.supplementHeader}>
                찾는 영양제를 선택해주세요 !:
              </Text>
              {results.map(item => (
                <TouchableOpacity
                  key={item.supplementSeq}
                  style={styles.supplementCard}
                  onPress={() => handleAddSupplement(item.supplementSeq)}>
                  <Text style={styles.supplementName}>{item.pillName}</Text>
                  <Image
                    source={{uri: item.imageUrl}}
                    style={styles.supplementImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <Text style={styles.loadingText}>waiting...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#a4f87b',
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    textAlignVertical: 'top',
    color: '#000',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#a4f87b',
  },
  saveButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#a4f87b',
    borderRadius: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
  },
  retakeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#a4f87b',
    borderRadius: 5,
  },
  retakeText: {
    color: 'white',
    fontSize: 16,
  },
  supplementContainer: {
    marginTop: 20,
    width: '100%',
  },
  supplementHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  supplementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  supplementName: {
    flex: 1,
    fontSize: 16,
  },
  supplementImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default OCRScreen;
