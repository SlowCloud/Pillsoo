import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import Header from './src/components/common/Header';
import BottomTabsNavigator from './src/navigation/BottomTabNavigator';
const App = () => {
  return (
    <NavigationContainer>
      {/* <Header /> */}
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
