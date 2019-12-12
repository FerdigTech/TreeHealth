import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { HomeScreen } from './components/routes/home/HomeScreen';
import { MapDisplay } from './components/routes/map/MapDisplay';
import {Icon} from 'native-base';

const MainNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapDisplay },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#0f2834',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      headerTintColor: 'white',
    },
  }
);

const bottomNavigator =createBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapDisplay },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="navigate" />;
      },
    }),
  },
);

const App = createAppContainer(MainNavigator, bottomNavigator);

export default App;
