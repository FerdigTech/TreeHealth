import React, { useEffect } from "react";
import { View, SafeAreaView, ScrollView, Text } from "react-native";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { ProjectCard } from "./../projects/ProjectCard";
import NavigationService from "../../../services/NavigationService";

const SecondIntroScreen = props => {
  useEffect(() => {
    props.start();
    props.copilotEvents.on("stop", () => {
      NavigationService.navigate("ThirdIntroScreen");
    });
  }, []);

  return (
    <React.Fragment>
      <SecondStep />
    </React.Fragment>
  );
};

const SecondStep = () => {
  const WalkthroughableView = walkthroughable(View);
  return (
    <SafeAreaView>
      <ScrollView>
        <CopilotStep
          text="You can select a project by clicking the item."
          order={1}
          name="projects"
        >
          <WalkthroughableView>
            <ProjectCard
              projectName={"Project Example One"}
              defaultImg={true}
              projectSummary={"This describes information about project one"}
              setProjectID={null}
              key={0}
            />
          </WalkthroughableView>
        </CopilotStep>
        <ProjectCard
          projectName={"Project Example Two"}
          defaultImg={true}
          projectSummary={"This describes information about project two"}
          setProjectID={null}
          key={1}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default copilot({
  animated: true,
  androidStatusBarVisible: true,
  overlay: "svg",
  verticalOffset: -42,
  tooltipStyle: {
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    paddingTop: 5,
  },
  stepNumberComponent: () => null,
  labels: {
    finish: "Next"
  }
})(SecondIntroScreen);
