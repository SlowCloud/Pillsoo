import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import {OCR_API_KEY} from '@env';
import { TOKEN } from '@env';

const OCRScreen = () => {
  const [ocrText, setOcrText] = useState<string | null>(null);

  useEffect(() => {
    handleCapture();
  }, []);

  const handleCapture = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.didCancel) {
      console.log('카메라 꺼짐');
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
        `https://vision.googleapis.com/v1/images:annotate`,
        {
          requests: [
            {
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
              image: {
                content: base64Image,
              },
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

      const detectedText =
        response.data.responses[0].textAnnotations[0].description;
      setOcrText(detectedText);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRetake = () => {
    setOcrText(null); // 텍스트를 초기화하고
    handleCapture(); // 카메라를 다시 호출
  };

  return (
    <View style={styles.container}>
      {ocrText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{ocrText}</Text>
          <TouchableOpacity onPress={handleRetake} style={styles.retakeButton}>
            <Text style={styles.retakeText}>다시 스캔하기</Text>
          </TouchableOpacity>
        </View>
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
  },
  loadingText: {
    fontSize: 18,
    color: '#a4f87b',
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
});

export default OCRScreen;
