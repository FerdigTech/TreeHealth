import React, { useEffect, useState } from "react";
import { AppLoading } from "expo";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { LoadingScreen } from "./components/routes/auth/LoadingScreen";
import { SignInScreen } from "./components/routes/auth/SignInScreen";
import { RegisterScreen } from "./components/routes/auth/RegisterScreen";
import { HomeScreen } from "./components/routes/home/HomeScreen";
import { MapDisplay } from "./components/routes/map/MapDisplay";
import { QuestionList } from "./components/routes/questions/QuestionList";
import { ProjectOverview } from "./components/routes/projects/ProjectOverview";
import { AddPoint } from "./components/routes/points/AddPoint";
import { PointQuestions } from "./components/routes/points/PointQuestions";
import { PointsStacked } from "./components/routes/map/PointsStacked";
import IntroScreen from "./components/routes/intro/IntroScreen";
import SecondIntroScreen from "./components/routes/intro/SecondIntroScreen";
import ThirdIntroScreen from "./components/routes/intro/ThirdIntroScreen";
import FourthIntroScreen from "./components/routes/intro/FourthIntroScreen";
import { ProjectWrapper } from "./context/ProjectWrapper";
import { View } from "react-native";
import globals from "./globals";
import NavigationService from "./services/NavigationService";

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
    QuestionList: {
      screen: QuestionList,
      navigationOptions: {
        title: "Projects Questions"
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
    },
    PointsStacked: {
      screen: PointsStacked
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

const App = () => {
  const [isReady, setisReady] = useState(false);

  useEffect(() => {
    async function setupFonts() {
      await Expo.Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
      });
      setisReady({ isReady: true });
    }

    setupFonts();
  }, []);
  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <ProjectWrapper>
      <InitalNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </ProjectWrapper>
  );
};

export default App;
