import React, { useEffect } from "react";
import { View, StyleSheet, Button, Platform } from "react-native";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import NavigationService from "../../../services/NavigationService";
import { HomeList } from "./../home/HomeList";

const IntroScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      props.start();
    }, 500);
    props.copilotEvents.on("stop", () => {
      NavigationService.navigate("SecondIntroScreen");
    });
  }, []);

  return (
    <React.Fragment>
      <FirstStep />
    </React.Fragment>
  );
};

const FirstStep = () => {
  const WalkthroughableView = walkthroughable(View);
  return (
    <View style={{ flex: 1 }}>
      <Button title="Logout" />
      <View style={styles.listLayout}>
        <HomeList menuAction={() => {}} iconName="people" menuName="About Us" />
        <HomeList
          menuAction={() => {}}
          iconName="hand"
          menuName="Introduction"
        />
        <CopilotStep
          text="This is how you navagate to your projects."
          order={1}
          name="homepage"
        >
          <WalkthroughableView>
            <HomeList
              menuAction={() => {}}
              iconName="map"
              menuName="Projects"
            />
          </WalkthroughableView>
        </CopilotStep>
      </View>
    </View>
  );
};

export default copilot({
  animated: true,
  overlay: "svg",
  tooltipStyle: {
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    paddingTop: 5
  },
  stepNumberComponent: () => null,
  labels: {
    finish: "Next"
  }
})(IntroScreen);

const styles = StyleSheet.create({
  listLayout: {
    justifyContent: "space-around",
    flex: 1
  }
});
