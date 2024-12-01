import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StatisticsScreen from './statisticsScreen';
import SettingsScreen from './settingsScreen';
import TimerScreen from './timerScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SettingsProvider } from './settingsContext';
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <SettingsProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Settings') {
                iconName = 'settings'
              } else if (route.name === 'Timer') {
                iconName = 'timer'
              } else {
                iconName = 'stats-chart'
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#33658A',
            headerShown: false,
          })}
        >
          <Tab.Screen name='Statistics' component={StatisticsScreen} />
          <Tab.Screen name='Timer' component={TimerScreen} />
          <Tab.Screen name='Settings' component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SettingsProvider>


  );
}
