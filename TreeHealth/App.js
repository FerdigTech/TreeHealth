import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {LoadingScreen} from './components/routes/auth/LoadingScreen';
import {SignInScreen} from './components/routes/auth/SignInScreen';
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

const bottomNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Map: MapDisplay,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="navigate" />;
      },
    }),
  },
);

const Tabs = createAppContainer(bottomNavigator);

const AuthStack = createStackNavigator(
  { SignIn: SignInScreen },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#0f2834',
      },
    },
  });

export default createAppContainer(createSwitchNavigator(
  {
    Loading: LoadingScreen,
    Home: MainNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Loading',
  }
));