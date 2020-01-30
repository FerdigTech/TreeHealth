import React from "react";
import { View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { LoadingScreen } from "./../routes/auth/LoadingScreen";
import { SignInScreen } from "./../routes/auth/SignInScreen";
import { RegisterScreen } from "./../routes/auth/RegisterScreen";
import { HomeScreen } from "./../routes/home/HomeScreen";
import { AboutUsScreen } from "./../routes/home/AboutUsScreen";
import { MapDisplay } from "./../routes/map/MapDisplay";
import { RecordList } from "./../routes/records/RecordList";
import { ProjectOverview } from "./../routes/projects/ProjectOverview";
import { AddPoint } from "./../routes/points/AddPoint";
import { PointQuestions } from "./../routes/points/PointQuestions";
import IntroScreen from "./../routes/intro/IntroScreen";
import SecondIntroScreen from "./../routes/intro/SecondIntroScreen";
import ThirdIntroScreen from "./../routes/intro/ThirdIntroScreen";
import FourthIntroScreen from "./../routes/intro/FourthIntroScreen";
import FifthIntroScreen from "./../routes/intro/FifthIntroScreen";
import globals from "./../../globals";

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Map: {
      screen: MapDisplay
    },
    IntroScreen: IntroScreen,
    SecondIntroScreen: SecondIntroScreen,
    ThirdIntroScreen: ThirdIntroScreen,
    FourthIntroScreen: FourthIntroScreen,
    FifthIntroScreen: FifthIntroScreen,
    RecordList: {
      screen: RecordList,
      navigationOptions: {
        title: "Records"
      }
    },
    AboutUsScreen: {
      screen: AboutUsScreen,
      navigationOptions: {
        title: "About Us"
      }
    },
    AddPoint: {
      screen: AddPoint,
      navigationOptions: {
        title: "Add Record"
      }
    },
    PointQuestions: {
      screen: PointQuestions,
      navigationOptions: {
        title: "Answer Questions"
      }
    },
    ProjectOverview: {
      screen: ProjectOverview,
      navigationOptions: {
        title: "Projects"
      }
    }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: globals.COLOR.DARK_BLUE
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

const AuthStack = createStackNavigator(
  {
    SignIn: {
      screen: SignInScreen
    },
    Register: {
      screen: RegisterScreen
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: globals.COLOR.DARK_BLUE
      },
      headerTitleStyle: {
        flex: 1,
        textAlign: "center",
        alignSelf: "center"
      },
      headerTintColor: "white",
      headerRight: <View />
    }
  }
);

const InitalNavigator = createAppContainer(
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

export default InitalNavigator;
