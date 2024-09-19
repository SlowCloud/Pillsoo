import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import BottomTabsNavigator from './BottomTabNavigator';
import HomeNavigator, {HomeStackParamList} from './HomeNavigator';
import RecommendScreen from '../screens/Recommend/RecommendScreen';
import MoreRecommendScreen from '../screens/Recommend/MoreRecommendScreen';
import MoreRecommendResultScreen from '../screens/Recommend/MoreRecommendResultScreen';
import RecommendCategoryScreen from '../screens/Recommend/RecommendCategoryScreen';
import DetailScreen from '../screens/Detail/DetailScreen';
import MyPageReviewListScreen from '../screens/MyPage/MyPageReviewListScreen';
import UserUpdateScreen from '../screens/MyPage/UserUpdateScreen';

export type AppStackParamList = {
  Auth: undefined;
  Main: undefined;
  Recommend: undefined;
  MoreRecommend: undefined;
  MoreRecommendResult: undefined;
  RecommendCategory: undefined;
  Detail: undefined;
  Home: {
    screen: keyof HomeStackParamList;
  };
  MyPageReviewList: undefined;
  UserUpdate: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Recommend" 
        component={RecommendScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MoreRecommend"
        component={MoreRecommendScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="MoreRecommendResult"
        component={MoreRecommendResultScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="RecommendCategory"
        component={RecommendCategoryScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeNavigator}
        options={{headerTitle: ''}}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{headerTitle: ''}}
      />
      <Stack.Screen
        name="MyPageReviewList"
        component={MyPageReviewListScreen}
        options={{headerTitle: ''}}
      />
      <Stack.Screen
        name="UserUpdate"
        component={UserUpdateScreen}
        options={{headerTitle: ''}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
