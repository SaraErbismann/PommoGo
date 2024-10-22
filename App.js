import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StatisticsScreen from './statisticsScreen';
import SettingsScreen from './statisticsScreen';
import TimerScreen from './timerScreen';

const Tab = createBottomTabNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Statistics' component={StatisticsScreen} />
        <Tab.Screen name='Timer' component={TimerScreen} />
        <Tab.Screen name='Settings' component={SettingsScreen} />

      </Tab.Navigator>
    </NavigationContainer>

  );
}
