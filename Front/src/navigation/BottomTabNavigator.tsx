import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchResultScreen';
import RecommendScreen from '../screens/Recommend/RecommendScreen';
import WishListScreen from '../screens/WishList/WishListScreen';
import ProfileScreen from '../screens/MyPage/MyPageScreen';

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00FF00',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: '#FAFAFA',
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate('홈')}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
        ),
        headerLeftContainerStyle: {left: 20},
      }}>
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="검색"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="영양제 추천"
        component={RecommendScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="thumbs-up-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: '영양제 추천',
        }}
      />
      <Tab.Screen
        name="위시 리스트"
        component={WishListScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: '위시 리스트',
        }}
      />
      <Tab.Screen
        name="프로필"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: '프로필',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
