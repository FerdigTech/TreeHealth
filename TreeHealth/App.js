import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { LoadingScreen } from "./components/routes/auth/LoadingScreen";
import { SignInScreen } from "./components/routes/auth/SignInScreen";
import { HomeScreen } from "./components/routes/home/HomeScreen";
import { MapDisplay } from "./components/routes/map/MapDisplay";

import { Icon } from "native-base";

const bottomNavigator = createBottomTabNavigator(
  {
    Map: {
      screen: MapDisplay,
      navigationOptions: {
        tabBarVisible: false
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="navigate" />;
      }
    })
  }
);

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Map: {
      screen: bottomNavigator,
      navigationOptions: {
        title: "Map",
        headerTitleStyle: {
          fontWeight: "bold",
          marginLeft: "auto",
          marginRight: "auto"
        },
        headerTintColor: "white"
      }
    }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#0f2834"
      }
    }
  }
);

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#0f2834"
      }
    }
  }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      Home: MainNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);
