import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView, Text } from "react-native";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import NavigationService from "../../../services/NavigationService";
import { QuestionItem } from "../questions/QuestionItem";
import { Container, Content, Footer, FooterTab, Icon, Fab } from "native-base";

const FifthIntroScreen = props => {
  useEffect(() => {
    props.start();
    props.copilotEvents.on("stop", () => {
      NavigationService.navigate("Home");
    });
  }, []);

  return (
    <React.Fragment>
      <FifthStep />
    </React.Fragment>
  );
};

const FifthStep = () => {
  const WalkthroughableView = walkthroughable(View);
  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }}>
            <CopilotStep
              text="Manage and edit existing records by wiping left on it."
              order={8}
              name="manage"
            >
              <WalkthroughableView>
                <QuestionItem
                  key={0}
                  indexVal={0}
                  pointData={{
                    county: "Cuyahoga",
                    createddate: 1576456361,
                    updateddate: 1576456361
                  }}
                  isDraft={false}
                />
              </WalkthroughableView>
            </CopilotStep>
            <QuestionItem
              key={1}
              indexVal={1}
              pointData={{
                county: "Portage",
                createddate: 1577925161,
                updateddate: 1578702761
              }}
              isDraft={false}
            />
          </ScrollView>
        </Content>
        <Fab
          active={false}
          direction="up"
          style={styles.filterIcon}
          position="bottomRight"
          onPress={() => {}}
        >
          <Icon type="Feather" name="filter" />
        </Fab>
        <CopilotStep
          text="When offline, your records will be queued to till you obtain a connection."
          order={9}
          name="offline"
        >
          <WalkthroughableView>
            <Footer>
              <FooterTab style={styles.footerStyle}>
                <Text style={styles.footerTxt}>
                  You have 2 item in offline queue.
                </Text>
              </FooterTab>
            </Footer>
          </WalkthroughableView>
        </CopilotStep>
      </Container>
    </SafeAreaView>
  );
};

export default copilot({
  animated: true,
  androidStatusBarVisible: true,
  overlay: "svg",
  verticalOffset: -62,
  tooltipStyle: {
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    paddingTop: 5
  },
  stepNumberComponent: () => null,
  labels: {
    finish: "Finish"
  }
})(FifthIntroScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  footerTxt: {
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
    flex: 1
  },
  footerStyle: {
    backgroundColor: "#f4f4f4",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    zIndex: 2
  },
  filterIcon: {
    backgroundColor: "#d9534f",
    zIndex: 5
  }
});
