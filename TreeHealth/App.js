import React, {useEffect, useState} from "react";
import {Text} from 'react-native';
import AppLoading from 'expo-app-loading';
import {ProjectWrapper} from "./context/ProjectWrapper";
import NavigationService from "./services/NavigationService";
import InitalNavigator from "./components/navagators/Navagators";
import {useFonts} from 'expo-font';

const App = () => {

  const [loaded] = useFonts({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
  });

  if (!loaded) {
    return <AppLoading/>;
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
