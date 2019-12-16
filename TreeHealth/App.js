import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { LoadingScreen } from "./components/routes/auth/LoadingScreen";
import { SignInScreen } from "./components/routes/auth/SignInScreen";
import { HomeScreen } from "./components/routes/home/HomeScreen";
import { MapDisplay } from "./components/routes/map/MapDisplay";
import { ProjectList } from "./components/routes/Menu/ProjectList";
import { View } from "react-native";

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Map: {
      screen: MapDisplay,
      navigationOptions: {
        title: "Map"
      }
    },
    ProjectList: {
      screen: ProjectList,
      navigationOptions: {
        title: "Projects"
      }
    }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#0f2834"
      },
      headerTitleStyle: {
        flex: 1,
        textAlign: "center",
        alignSelf: "center"
      },
      // this is because the back button offsets by 40
      headerRight: <View />,
      headerTintColor: "white"
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
