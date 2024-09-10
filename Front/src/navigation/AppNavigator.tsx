import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import BottomTabsNavigator from './BottomTabNavigator';
import HomeNavigator, {HomeStackParamList} from './HomeNavigator';
import RecommendScreen from '../screens/Recommend/RecommendScreen';
import MoreRecommendScreen from '../screens/Recommend/MoreRecommendScreen';

export type AppStackParamList = {
  Auth: undefined;
  Main: undefined;
  Recommend: undefined;
  MoreRecommend: undefined;
  Home: {
    screen: keyof HomeStackParamList;
  };
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
        // options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeNavigator}
        options={{headerTitle: ''}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
