import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { LoadingScreen } from "./components/routes/auth/LoadingScreen";
import { SignInScreen } from "./components/routes/auth/SignInScreen";
import { HomeScreen } from "./components/routes/home/HomeScreen";
import { MapDisplay } from "./components/routes/map/MapDisplay";
import { QuestionList } from "./components/routes/questions/QuestionList";
import { ProjectOverview } from "./components/routes/projects/ProjectOverview";
import { ProjectStacked } from "./components/routes/projects/ProjectStacked";
import { ProjectWrapper } from "./ProjectWrapper";
import { View } from "react-native";
import globals from "./globals";

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Map: {
      screen: MapDisplay
    },
    QuestionList: {
      screen: QuestionList,
      navigationOptions: {
        title: "Projects Questions"
      }
    },
    ProjectOverview: {
      screen: ProjectOverview,
      navigationOptions: {
        title: "Projects"
      }
    },
    ProjectStacked: {
      screen: ProjectStacked
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

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: globals.COLOR.DARK_BLUE
      }
    }
  }
});

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

export default function App(){
    return (
      <ProjectWrapper>
        <InitalNavigator />
      </ProjectWrapper>
    );
}
