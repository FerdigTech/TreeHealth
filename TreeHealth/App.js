import React, { useEffect, useState } from "react";
import { AppLoading } from "expo";
import { ProjectWrapper } from "./context/ProjectWrapper";
import NavigationService from "./services/NavigationService";
import InitalNavigator from "./components/navagators/Navagators";
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
