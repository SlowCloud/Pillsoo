import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SupplementInputScreen from '../screens/Home/SupplementInputScreen';
import OCRScreen from '../screens/Home/OCRScreen';
import AlarmScreen from '../screens/Home/AlarmScreen';

export type HomeStackParamList = {
  SupplementInput: undefined;
  OCR: undefined;
  Alarm: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SupplementInput"
        component={SupplementInputScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OCR"
        component={OCRScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
