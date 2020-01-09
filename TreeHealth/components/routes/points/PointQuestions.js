import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Animated
} from "react-native";
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
import { QuestionModal } from "./QuestionModal";
import globals from "../../../globals";

getQuestionsData = async ID => {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  const questionsData = await fetch(
    globals.SERVER_URL + "/questions/" + projectID
  ).then(response => response.json());
  return questionsData;
};

const processQuestData = ID => {
  return new Promise(resolve => {
    resolve(getQuestionsData(ID));
  });
};

export const PointQuestions = props => {
  const [Questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [CompleteQuestions, setCompleteQuestions] = useState([]);
  const [ShowModal, setShowModal] = useState(false);
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  let animation = useRef(new Animated.Value(0));

  const handleQuestion = ID => {
    // first we must pass to current question to the navigator
    setCurrentQuestion(ID);
    // then we toggle the modal
    setShowModal(true);
  };

  const saveAnswers = answer => {
    // save the answer locally

    // marked finished
    finishQuestion(CurrentQuestion);
    // closed modal
    setShowModal(false);
  };

  const addToQueue = answers => {
    //TODO: add to global queue
    // if offline, then wait till online
    // otherwise submit the data to its repsective endpoint
  };

  const finishQuestion = ID => {
    if (!CompleteQuestions.includes(ID)) {
      setCompleteQuestions(CompleteQuestions => [...CompleteQuestions, ID]);
      // seems like CompleteQuestions hasn't been finished being set yet, so we add one
      setProgress(
        Math.round((CompleteQuestions.length + 1) / Questions.length * 100)
      );
    }
  };

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  });

  useEffect(
    () => {
      processQuestData(-1).then(results => {
        setQuestions(results);
      });
      Animated.timing(animation.current, {
        toValue: progress,
        duration: 100
      }).start();
    },
    [progress]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <QuestionModal
            ShowModal={ShowModal}
            // should save on close and untoggle modal visibility
            handleSave={saveAnswers}
            QuestionData={Questions.filter(
              question => question.QuestionID === CurrentQuestion
            )}
          />
          <View style={styles.progressBar}>
            <Animated.View
              style={
                ([StyleSheet.absoluteFill],
                { backgroundColor: globals.COLOR.GREEN, width })
              }
            />
          </View>
          <ScrollView style={styles.questionList}>
            {Questions.map((question, index) => {
              return (
                <ListItem key={index} thumbnail>
                  <Left>
                    <Thumbnail square source={{ uri: question.image }} />
                  </Left>
                  <Body>
                    <Text numberOfLines={1} style={styles.questionDesc}>
                      {question.Description}
                    </Text>
                  </Body>
                  <Right
                    style={[
                      styles.rightStyling,
                      {
                        borderColor: CompleteQuestions.includes(
                          question.QuestionID
                        )
                          ? "green"
                          : "red"
                      }
                    ]}
                  >
                    <Button
                      transparent
                      onPress={() => {
                        handleQuestion(question.QuestionID);
                      }}
                    >
                      <Text style={styles.answerBtn}>Answer</Text>
                    </Button>
                  </Right>
                </ListItem>
              );
            })}

            <Button
              disabled={progress != 100}
              block
              rounded
              style={styles.completeBtn}
              onPress={() => {
                addToQueue();
              }}
            >
              <Text style={{ color: "white" }}>Complete</Text>
            </Button>
          </ScrollView>
        </Content>
      </Container>
    </SafeAreaView>
  );
};

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
