import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import BottomTabsNavigator from './BottomTabNavigator';
import RecommendScreen from '../screens/Recommend/RecommendScreen';
import MoreRecommendScreen from '../screens/Recommend/MoreRecommendScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recommend"
        component={RecommendScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreRecommend"
        component={MoreRecommendScreen}
        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
