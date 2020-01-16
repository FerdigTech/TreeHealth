import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions
} from "react-native";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import MapView, { Marker } from "react-native-maps";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Icon,
  Button
} from "native-base";
import NavigationService from "../../../services/NavigationService";

const ThirdIntroScreen = props => {
  const [stepName, setstate] = useState(null);
  useEffect(() => {
    props.start();
    props.copilotEvents.on("stepChange", handleStepChange);
    props.copilotEvents.on("stop", () => {
      NavigationService.navigate("ThirdIntroScreen");
    });
  }, []);

  handleStepChange = step => {
    if (step.name != stepName) {
      setstate(step.name);
    }
  };

  return (
    <React.Fragment>
      <ThirdStep currentStep={stepName} />
    </React.Fragment>
  );
};

const ThirdStep = props => {
  const WalkthroughableView = walkthroughable(View);
  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: 41.215078,
              longitude: -81.562843,
              latitudeDelta: 3 / 4,
              longitudeDelta: 3 / 4
            }}
            showsUserLocation={true}
            showsTraffic={false}
            loadingEnabled={true}
            cacheEnabled={true}
          >
            <Marker
              coordinate={{
                longitude: 41.50191905,
                latitude: -81.4899204
              }}
              title={"Point one"}
              key={0}
              pinColor={"red"}
            />
            <Marker
              coordinate={{
                longitude: 41.37539391,
                latitude: -81.57394661
              }}
              title={"Point two"}
              key={1}
              pinColor={"blue"}
            />
          </MapView>
        </Content>
        <Footer>
          <FooterTab style={styles.footerStyle}>
            <CopilotStep
              text="Manage and view existing points from a stacked view."
              order={5}
              name="stacked"
            >
              <WalkthroughableView>
                {props.currentStep == "stacked" && (
                  <Button>
                    <Icon
                      type="Feather"
                      style={styles.footerIcnStyle}
                      name="list"
                    />
                  </Button>
                )}
              </WalkthroughableView>
            </CopilotStep>
          </FooterTab>
          <FooterTab style={styles.footerStyle}>
            <CopilotStep
              text="Apply filter(s) to record(s) to limit how many are displayed."
              order={4}
              name="filter"
            >
              <WalkthroughableView>
                {props.currentStep == "filter" && (
                  <Button>
                    <Icon
                      type="Feather"
                      style={styles.footerIcnStyle}
                      name="filter"
                    />
                  </Button>
                )}
              </WalkthroughableView>
            </CopilotStep>
          </FooterTab>
          <FooterTab style={styles.footerStyle}>
            <Button />
          </FooterTab>
          <FooterTab style={styles.footerStyle}>
            <CopilotStep
              text="You can add a record to a project by clicking the plus."
              order={3}
              name="add record"
            >
              <WalkthroughableView>
                {props.currentStep == "add record" && (
                  <Button>
                    <Icon
                      type="Feather"
                      style={styles.footerIcnStyle}
                      name="plus"
                    />
                  </Button>
                )}
              </WalkthroughableView>
            </CopilotStep>
          </FooterTab>
        </Footer>
      </Container>
    </SafeAreaView>
  );
};

export default copilot({
  animated: true,
  androidStatusBarVisible: true,
  overlay: "svg",
  verticalOffset: -32,
  tooltipStyle: {
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    paddingTop: 5
  },
  labels: {
    finish: "Next"
  }
  //svgMaskPath: circleSvgPath
})(ThirdIntroScreen);

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  footerStyle: {
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    flex: 2
  },
  footerIcnStyle: {
    color: "black"
  }
});
