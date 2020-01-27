import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useReducer
} from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  Animated,
  AsyncStorage
} from "react-native";
import {
  Container,
  Content,
  ListItem,
  Left,
  Right,
  Body,
  Thumbnail,
  Button,
  Toast
} from "native-base";
import { QuestionModal } from "./QuestionModal";
import globals from "../../../globals";
import NavigationService from "../../../services/NavigationService";
import { ProjectContext } from "../../../context/ProjectProvider";
import { ProgressBar } from "../../reusable/ProgessBar";
import { AppLoading } from "expo";
import _ from "underscore";

getQuestionsData = async ID => {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  let questionsStored = await AsyncStorage.getItem(
    "questions-PID-" + projectID
  );
  let questionsData = [];
  if (questionsStored !== null) {
    questionsData = JSON.parse(questionsStored);
  } else {
    questionsData = await fetch(
      globals.SERVER_URL + "/questions/" + projectID
    ).then(response => response.json());
    await AsyncStorage.setItem(
      "questions-PID-" + projectID,
      JSON.stringify(questionsData)
    );
  }

  return questionsData;
};

const processQuestData = ID => {
  return new Promise(resolve => {
    resolve(getQuestionsData(ID));
  });
};

getAnswerData = async ID => {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  const questionsData = await fetch(
    globals.SERVER_URL + "/answerByLocationID/" + projectID
  ).then(response => response.json());
  return questionsData;
};

const processAnswerData = ID => {
  return new Promise(resolve => {
    resolve(getAnswerData(ID));
  });
};

export const PointQuestions = props => {
  const [Questions, setQuestions] = useState([]);
  const [Answers, setAnswers] = useState([]);
  const [SavedAnswers, setSavedAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [CompleteQuestions, setCompleteQuestions] = useState([]);
  const [ShowModal, setShowModal] = useState(false);
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  let animation = useRef(new Animated.Value(0));
  const context = useContext(ProjectContext);
  const location = props.navigation.getParam("location", null);
  const locationID = props.navigation.getParam("locationid", null);

  const handleQuestion = ID => {
    // first we must pass to current question to the navigator
    setCurrentQuestion(ID);
    // then we toggle the modal
    setShowModal(true);
  };

  const saveAnswers = answer => {
    let newAnswerObj = Answers;
    newAnswerObj[CurrentQuestion] = answer;
    setAnswers(newAnswerObj);

    // marked finished
    finishQuestion(CurrentQuestion);
    // closed modal
    setShowModal(false);
  };

  const addToQueue = () => {
    if (locationID == null) {
      // send over the location and all the answers
      context.addToOfflineQueue({ location: location, answers: Answers });
    } else {
      // if there are any difference in answers we must send it to the server
      SavedAnswers.filter(savedAnswer => {
        const answerOne = Answers[savedAnswer.questionID];
        const answerTwo = savedAnswer.answer;
        const differentOfLarger =
          answerOne.length > answerTwo.length
            ? _.difference(answerOne, answerTwo)
            : _.difference(answerTwo, answerOne);
        return Array.isArray(answerOne)
          ? differentOfLarger.length !== 0
          : // old answer is a string so could be carded to int (so no strict typing)
            answerOne != answerTwo;
      }).map(differentAnswer => {
        const AnswerToUpdate = {
          answerID: differentAnswer.answerID,
          answer: Answers[differentAnswer.questionID]
        };
        context.addToOfflineQueue(AnswerToUpdate);
      });
    }
    NavigationService.navigate("Map", {
      projectName: context.ProjectName
    });
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

  // when the component is mounted
  useEffect(() => {
    // we pull in all questions for this project

    if (Questions.length <= 0) {
      processQuestData(context.ProjectID).then(results => {
        setQuestions(
          results !== "undefined"
            ? results.hasOwnProperty("result")
              ? results.result
              : []
            : []
        );
      });
    }

    // if a locationID is present, the user is editing submited data
    // so we must pull in their previous answers
    if (locationID != null && SavedAnswers.length == 0) {
      processAnswerData(locationID).then(results => {
        let newAnswerObj = [];

        results.result.map(answerObj => {
          // set the answer to its repsect questionID
          newAnswerObj[answerObj.questionid] = answerObj.answer;
          // notated the user has already finished the question
          setCompleteQuestions(CompleteQuestions => [
            ...CompleteQuestions,
            answerObj.questionid
          ]);

          // save the old values to compare to later
          const SavedAnswerObj = {
            questionID: answerObj.questionid,
            answerID: answerObj.answerid,
            answer: answerObj.answer
          };

          let OldSavedAnswersVal = SavedAnswers;

          OldSavedAnswersVal.push(SavedAnswerObj);
          setSavedAnswers(OldSavedAnswersVal);
        });

        // set all the answers
        setAnswers(newAnswerObj);
        // answers have been loaded, so the user has perms to submit the data
        setProgress(100);
      });
    }
  }, []);

  // whenever progress is updated, we must Animate it
  useEffect(
    () => {
      Animated.timing(animation.current, {
        toValue: progress,
        duration: 100
      }).start();
    },
    [progress]
  );

  if (
    (SavedAnswers.length <= 0 && locationID != null) ||
    Questions.length <= 0
  ) {
    return <AppLoading />;
  }

  // TODO: if we get passed a locationID, then we must send a request to /answerByLocationID/<locationID>
  // and set the Answers state to be all the response values
  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <QuestionModal
            ShowModal={ShowModal}
            // should save on close and untoggle modal visibility
            handleSave={saveAnswers}
            currentAnswers={Answers}
            QuestionData={Questions.filter(
              question => question.questionid === CurrentQuestion
            )}
          />
          <ProgressBar progress={width} />
          <ScrollView style={styles.questionList}>
            {Questions.map((question, index) => {
              // cache the image, could be swapped out for a cache management to avoid flickering
              Image.prefetch(question.image);
              return (
                <ListItem
                  thumbnail
                  key={index}
                  onPress={() => {
                    handleQuestion(question.questionid);
                  }}
                >
                  <Left>
                    <Thumbnail square source={{ uri: question.image }} />
                  </Left>
                  <Body>
                    <Text numberOfLines={1} style={styles.questionDesc}>
                      {question.description}
                    </Text>
                  </Body>
                  <Right
                    style={[
                      styles.rightStyling,
                      {
                        borderColor: CompleteQuestions.includes(
                          question.questionid
                        )
                          ? "green"
                          : "red"
                      }
                    ]}
                  />
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
  }
});
