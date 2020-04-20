import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Platform
} from "react-native";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import Moment from "moment";
import NavigationService from "../../../services/NavigationService";
import { RecordItem } from "../records/RecordItem";
import { Container, Content, Footer, FooterTab, Icon, Fab } from "native-base";
import { ProgressBar } from "../../reusable/ProgessBar";

const FifthIntroScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      props.start();
    }, 500);
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
              text="Manage and edit existing records by swiping left on it."
              order={8}
              name="manage"
            >
              <WalkthroughableView>
                <RecordItem
                  key={0}
                  indexVal={0}
                  pointData={{
                    title: Moment(Moment.unix(1576456361)).format("LL") + " - " + "Cuyahoga",
                    updateddate: Moment(Moment.unix(1576456361)).format("LL")
                  }}
                  isDraft={false}
                />
              </WalkthroughableView>
            </CopilotStep>
            <RecordItem
              key={1}
              indexVal={1}
              pointData={{
                title: Moment(Moment.unix(1577925161)).format("LL") + " - " + "Portage",
                updateddate: Moment(Moment.unix(1578702761)).format("LL")
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
          text="When offline, your records will be queued until you obtain a connection."
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

FifthIntroScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <ProgressBar progress={"100%"} />
});

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
