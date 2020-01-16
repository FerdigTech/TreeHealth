import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from "react-native";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import NavigationService from "../../../services/NavigationService";
import {
  Container,
  Content,
  ListItem,
  Left,
  Right,
  Body,
  Thumbnail,
  Button
} from "native-base";
import globals from "../../../globals";

const FourthIntroScreen = props => {
  useEffect(() => {
    props.start();
    props.copilotEvents.on("stop", () => {
      NavigationService.navigate("Home");
    });
  }, []);

  return (
    <React.Fragment>
      <FourthStep />
    </React.Fragment>
  );
};

const FourthStep = () => {
  const WalkthroughableView = walkthroughable(View);
  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <View style={styles.progressBar}>
            <View
              style={
                ([StyleSheet.absoluteFill],
                { backgroundColor: globals.COLOR.GREEN, width: "33%" })
              }
            />
          </View>
          <ScrollView style={styles.questionList}>
            <ListItem thumbnail key={0} onPress={() => {}}>
              <Left>
                <Thumbnail
                  square
                  source={require("./../../../assets/icon.png")}
                />
              </Left>
              <Body>
                <Text numberOfLines={1} style={styles.questionDesc}>
                  Your first question will be described here.
                </Text>
              </Body>
              <Right
                style={[
                  styles.rightStyling,
                  {
                    borderColor: "red"
                  }
                ]}
              />
            </ListItem>
            <ListItem thumbnail key={1} onPress={() => {}}>
              <Left>
                <Thumbnail
                  square
                  source={require("./../../../assets/icon.png")}
                />
              </Left>
              <Body>
                <Text numberOfLines={1} style={styles.questionDesc}>
                  Your second question will be described here.
                </Text>
              </Body>
              <Right
                style={[
                  styles.rightStyling,
                  {
                    borderColor: "red"
                  }
                ]}
              />
            </ListItem>
            <CopilotStep
              text="You can answer a question by clicking on it. A question will indicate whether it has an answer by the border color."
              order={6}
              name="question item"
            >
              <WalkthroughableView>
                <ListItem thumbnail key={2} onPress={() => {}}>
                  <Left>
                    <Thumbnail
                      square
                      source={require("./../../../assets/icon.png")}
                    />
                  </Left>
                  <Body>
                    <Text numberOfLines={1} style={styles.questionDesc}>
                      Your third question will be described here.
                    </Text>
                  </Body>
                  <Right
                    style={[
                      styles.rightStyling,
                      {
                        borderColor: "green"
                      }
                    ]}
                  />
                </ListItem>
              </WalkthroughableView>
            </CopilotStep>
            <CopilotStep
              text="Once you finish all required questions, you'll be able to submit your record."
              order={7}
              name="answer"
            >
              <WalkthroughableView>
                <Button disabled block rounded style={styles.completeBtn}>
                  <Text style={{ color: "white" }}>Complete</Text>
                </Button>
              </WalkthroughableView>
            </CopilotStep>
          </ScrollView>
        </Content>
      </Container>
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
    paddingTop: 5
  },
  labels: {
    finish: "Finish"
  }
})(FourthIntroScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  questionList: {
    paddingTop: 1
  },
  questionDesc: {
    fontWeight: "bold",
    padding: 5
  },
  answerBtn: {
    color: "blue"
  },
  completeBtn: {
    justifyContent: "center",
    margin: 10,
    marginTop: 20
  },
  rightStyling: {
    borderRightWidth: 10,
    borderBottomColor: "#ccc",
    marginBottom: 1,
    marginTop: 1
  },
  progressBar: {
    flexDirection: "row",
    height: 20,
    width: "100%",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0
  }
});
