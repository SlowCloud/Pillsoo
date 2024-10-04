import React, {useCallback, useState} from 'react';
import {StyleSheet, View, ScrollView, Image, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import styled from '@emotion/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface MyKitData {
  supplementSeq: number;
  PILL_NAME: string;
  FUNCTIONALITY: string;
  imageUrl: string;
}

const CarouselContainer = styled.View`
  flex: 1;
`;

const CarouselItemContainer = styled.View`
  width: ${(props: {width: number}) => props.width}px;
  height: 100%;
  padding: 20px;
`;

const CarouselItem = styled.View`
  flex: 1;
  align-items: center;
`;

function MyKit() {
  const [myKitData, setMyKitData] = useState<MyKitData[]>([]);
  const [itemWidth, setItemWidth] = useState<number>(0);
  const userSeq = useSelector((state: {useSeq: number}) => state.useSeq);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / itemWidth);
    setCurrentIndex(index);
  };

  const handleScrollToIndex = (index: number) => {
    const scrollTo = index * itemWidth;
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: scrollTo, animated: true});
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchMyKitData = async () => {
        const storedToken = await AsyncStorage.getItem('jwt_token');

        try {
          const response = await axios.get(`${API_URL}/api/v1/cabinet`, {
            headers: {
              access: `${storedToken}`,
            },
            params: {
              userSeq: userSeq,
            },
          });
          setMyKitData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMyKitData();
    }, [userSeq]),
  );

  return (
    <View style={styles.container}>
      {myKitData.length > 0 ? (
        <View>
          <ScrollView
            style={styles.scrollViewContainer}
            horizontal
            pagingEnabled
            contentContainerStyle={{width: `${100 * myKitData.length}%`}}
            scrollEventThrottle={200}
            decelerationRate="fast"
            onContentSizeChange={w => {
              const width = w / myKitData.length;
              setItemWidth(width > 0 ? width : 0);
            }}
            onScroll={onScroll}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              {myKitData.map(item => (
                <CarouselItemContainer
                  key={item.supplementSeq}
                  width={itemWidth}>
                  <CarouselItem>
                    <Image
                      source={
                        item.imageUrl && item.imageUrl.trim() !== ''
                          ? {uri: item.imageUrl}
                          : require('../../assets/noImage.png')
                      }
                      resizeMode="cover"
                      style={styles.image}
                    />
                  </CarouselItem>
                </CarouselItemContainer>
              ))}
            </View>
          </ScrollView>
          <View style={styles.pagination}>
            {myKitData.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
                onPress={() => handleScrollToIndex(index)}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>마이키트에 영양제가 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // 데이터를 가운데 배치
    alignItems: 'center', // 데이터를 가운데 배치
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    height: '70%',
    width: '75%',
    resizeMode: 'contain',
    marginTop: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: -70,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 5,
    marginBottom: 100,
  },
  activeDot: {
    backgroundColor: '#B5C0D0',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default MyKit;
