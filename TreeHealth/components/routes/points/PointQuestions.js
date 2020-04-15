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
  AsyncStorage,
  TouchableOpacity
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
  DatePicker,
  CheckBox
} from "native-base";
import { QuestionModal } from "./QuestionModal";
import globals from "../../../globals";
import NavigationService from "../../../services/NavigationService";
import { ProjectContext } from "../../../context/ProjectProvider";
import { ProgressBar } from "../../reusable/ProgessBar";
import { AppLoading } from "expo";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import _ from "underscore";
import Moment from "moment";
import {
  processAnswerData,
  processQuestData
} from "./../../../services/FetchService";

export const PointQuestions = props => {
  const [Questions, setQuestions] = useState([]);
  const [Answers, setAnswers] = useState([]);
  const [SavedAnswers, setSavedAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [CompleteQuestions, setCompleteQuestions] = useState([]);
  const [CompleteManQuestions, setCompleteManQuestions] = useState([]);
  const [CreationDate, setCreationDate] = useState(new Date());
  const [PrivatePoint, setPrivatePoint] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [HasPermission, setHasPermission] = useState(true);
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  let animation = useRef(new Animated.Value(0));
  const context = useContext(ProjectContext);
  const location = props.navigation.getParam("location", null);
  const locationID = props.navigation.getParam("locationid", null);
  const DatepickerRef = useRef(null);

  const handleQuestion = ID => {
    // first we must pass to current question to the navigator
    setCurrentQuestion(ID);
    // then we toggle the modal
    setShowModal(true);
  };

  const saveDate = date => {
    setCreationDate(date);
  };

  const saveAnswers = (answer, ismandatory) => {
    let newAnswerObj = Answers;
    const indexOfQuestion = Answers.findIndex(answer => answer.questionid ===  CurrentQuestion);
    newAnswerObj[indexOfQuestion].answer = answer;

    
    setAnswers(newAnswerObj);
    if (
      (CurrentPointData[0].name == "Fill in" ||
        CurrentPointData[0].name == "Image") &&
      answer == ""
    ) {
      // was image question or text question and they gave no answer, so it wasn't finished
      // todo we should check to see if the user delete the data from an already finished question
    } else {
      // marked finished
      finishQuestion(CurrentQuestion, ismandatory);
    }

    // closed modal
    setShowModal(false);
  };

  const handleCamera = async (cb, ismandatory) => {
    const result = await ImagePicker.launchCameraAsync({
      base64: true
    });
    if (!result.cancelled) {
      saveAnswers(result.base64, ismandatory);
      cb.apply(result.base64);
    }
    cb.apply("");
  };

  const handlePicker = async (cb, ismandatory) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true
    });
    if (!result.cancelled) {
      saveAnswers(result.base64, ismandatory);
      cb.apply(result.base64);
    }
    cb.apply("");
  };
  const addToQueue = () => {
    if (locationID == null) {
      // send over the location and all the answers
      context.addToOfflineQueue({
        location: location,
        answers:  Answers.filter(answer => answer.answer != null),
        // converts the date to a standard epoch time
        createddate:
          typeof CreationDate == "number"
            ? CreationDate
            : new Date(CreationDate).getTime(),
        ispublic: !PrivatePoint
      });
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
  const finishQuestion = (ID, ismandatory) => {
    // if we finish a question again (or edit it) the status should be the same
    if (!CompleteQuestions.includes(ID) && !CompleteManQuestions.includes(ID)) {
      // if mandatory then we need to mark it finished
      if (ismandatory) {
        setCompleteManQuestions(CompleteManQuestions => [
          ...CompleteManQuestions,
          ID
        ]);

        console.log("values", (CompleteManQuestions.length + 1) / Questions.filter(questions => questions.ismandatory).length);
        setProgress(
          Math.round(
            ((CompleteManQuestions.length + 1) /
            Questions.filter(questions => questions.ismandatory).length) * 100
            )
        );
      } else {
        setCompleteQuestions(CompleteQuestions => [...CompleteQuestions, ID]);
      }
    }
  };

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  });

  // when the component is mounted
  useEffect(() => {
    // get perms for camera
    if (!HasPermission) {
      (async () => {
        const cameraPerm = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPerm = await Permissions.askAsync(
          Permissions.CAMERA_ROLL
        );
        setHasPermission(
          cameraPerm.status === "granted" && cameraRollPerm.status === "granted"
        );
      })();
    }

    // we pull in all questions for this project
    if (Questions.length <= 0) {
      processQuestData(context.ProjectID, context.AuthToken).then(results => {
        setQuestions(results);
        // if there are no manditory questions no need to force any questions
        if (results.filter(questions => questions.ismandatory).length === 0 && progress !== 100) setProgress(100);
        // prepare answer object
        results.map(questions => {
          // for each answer, we should have some information about it
          setAnswers(Answers => [
            ...Answers,
            {
              questionid: questions.questionid,
              answer: "",
              createdby: questions.createdby,
            }
          ])

        })
      });
    }

    // if a locationID is present, the user is editing submited data
    // so we must pull in their previous answers
    if (locationID != null && SavedAnswers.length == 0) {
      processAnswerData(locationID, context.AuthToken).then(results => {
        let newAnswerObj = [];

        results.result.map(answerObj => {
          // set the answer to its repsect questionID
          newAnswerObj[answerObj.questionid] = answerObj.answer;
          // notated the user has already finished the question
          setCompleteQuestions(CompleteQuestions => [
            ...CompleteQuestions,
            answerObj.questionid
          ]);

          // todo add manditory question rehaul for updating answers (if there was a need to properly handle manditory questions)

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

  if (HasPermission === false) {
    return <Text>Please give access to use the camera and camera roll.</Text>;
  }

  const CurrentPointData = Questions.filter(
    question => question.questionid === CurrentQuestion
  );
  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <QuestionModal
            ShowModal={ShowModal}
            // should save on close and untoggle modal visibility unless image, then we just close the modal
            handleSave={saveAnswers}
            currentAnswers={Answers}
            handleCamera={handleCamera}
            handlePicker={handlePicker}
            QuestionData={CurrentPointData}
          />
          <ProgressBar progress={width} />
          <ScrollView style={styles.questionList}>
            {// during creation, we can allow for them to pick this date
            locationID == null && (
              <React.Fragment>
                <ListItem>
                  <Left>
                    <Text style={styles.questionDesc}>
                      Select Creation Date:
                    </Text>
                  </Left>
                  <Body>
                    <DatePicker
                      defaultDate={new Date()}
                      locale={"en"}
                      ref={DatepickerRef}
                      textStyle={{ color: "blue" }}
                      animationType={"fade"}
                      formatChosenDate={date => {
                        return Moment(date).format("LL");
                      }}
                      onDateChange={saveDate}
                    />
                  </Body>
                </ListItem>
                <ListItem>
                  <Left>
                    <Text style={styles.questionDesc}>Private Record?:</Text>
                  </Left>
                  <Body>
                    <CheckBox
                      onPress={() => setPrivatePoint(!PrivatePoint)}
                      checked={PrivatePoint}
                      color="black"
                    />
                  </Body>
                </ListItem>
              </React.Fragment>
            )}
            {Questions.map((question, index) => {
              // cache the image, could be swapped out for a cache management to avoid flickering
              if (question.imageurl != "0")
                Image.prefetch(question.imageurl);
              return (
                <ListItem
                  thumbnail
                  key={index}
                  onPress={() => {
                    handleQuestion(question.questionid);
                  }}
                >
                  <Left>
                    <Thumbnail square source={ 
                      (question.imageurl != "0" ?  {uri: question.imageurl} : require("../../../assets/treehouse-default.png")) 
                    } />
                  </Left>
                  <Body>
                    <Text numberOfLines={1} style={styles.questionDesc}>
                      {question.name} question 
                      {question.ismandatory && (<Text style={styles.required}> *</Text>)}
                    </Text>
                  </Body>
                  <Right
                    style={[
                      styles.rightStyling,
                      {
                        borderColor:
                          CompleteQuestions.includes(question.questionid) ||
                          CompleteManQuestions.includes(question.questionid)
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
  required: {
    color: "red",
    fontWeight: "bold"
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
