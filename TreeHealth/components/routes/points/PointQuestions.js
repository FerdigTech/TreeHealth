import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useReducer,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  Animated,
  Platform,
} from 'react-native';
import {
  Container,
  Content,
  ListItem,
  Left,
  Right,
  Body,
  View,
  Thumbnail,
  Button,
  DatePicker,
  CheckBox,
} from 'native-base';
import { QuestionModal } from './QuestionModal';
import NavigationService from '../../../services/NavigationService';
import { ProjectContext } from '../../../context/ProjectProvider';
import { ProgressBar } from '../../reusable/ProgessBar';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import _ from 'underscore';
import Moment from 'moment';
import {
  processAnswerData,
  processQuestData,
  getQuestionsData
} from './../../../services/FetchService';
import DateTimePickerModal from "react-native-modal-datetime-picker";


export const PointQuestions = (props) => {
  const [Questions, setQuestions] = useState([]);
  const [Answers, setAnswers] = useState([]);
  const [SavedAnswers, setSavedAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [CompleteQuestions, setCompleteQuestions] = useState([]);
  const [CompleteManQuestions, setCompleteManQuestions] = useState([]);
  const [creationDate, setCreationDate] = useState(new Date());
  const [PrivatePoint, setPrivatePoint] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);

  const [hasPermission, setHasPermission] = useState(null);

  //const [QuestionsData, setQuestionsData] = useState([]);
  //const [selectedDate, setSelectedDate] = useState(new Date());



  let animation = useRef(new Animated.Value(0));
  const context = useContext(ProjectContext);
  const location = props.navigation.getParam('location', null);
  const locationID = props.navigation.getParam('locationid', null);
  const DatepickerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQuestion = (ID) => {
    // first we must pass to current question to the navigator
    setCurrentQuestion(ID);
    // then we toggle the modal
    setShowModal(true);
  };


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    // console.warn("A date has been picked: ", date);
    hideDatePicker();
    setCreationDate(date);
  };


  // const saveDate = (date) => {
  //  // console.log("date-----inside savedate----", date);
  //   setCreationDate(date);

  // };
  //console.log("date-----outside savedate----", CreationDate);



  // const onChangeMINE = (event, selectedDate) => {
  // //  console.log("Inside onChangeMINE.  selectedDate=" + selectedDate);
  //   setSelectedDate(selectedDate);
  // }

  // console.log("selected dat------------", selectedDate);


  const saveAnswers = (answer, ismandatory) => {
    let newAnswerObj = Answers;
    const indexOfQuestion = Answers.findIndex(
      (answer) => answer.questionid === CurrentQuestion
    );
    newAnswerObj[indexOfQuestion].answer = answer;

    setAnswers(newAnswerObj);
    if (answer == '' || answer == null) {
      // they gave no answer, so it wasn't finished
      unfinishQuestion(CurrentQuestion, ismandatory);
    } else {
      // marked finished
      finishQuestion(CurrentQuestion, ismandatory);
    }

    // closed modal
    setShowModal(false);
  };

  const handleCamera = async (cb, ismandatory) => {
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        base64: false,
      });
      if (!result.cancelled) {
        saveAnswers(result.uri, ismandatory);
        cb.apply(result.uri);
      }
    }
    cb.apply('');
  };

  const handlePicker = async (cb, ismandatory) => {
    if (hasPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: false,
      });
      if (!result.cancelled) {
        saveAnswers(result.uri, ismandatory);
        cb.apply(result.uri);
      }
    }
    cb.apply('');
  };

  const addToQueue = () => {
    if (locationID == null) {
      // send over the location and all the answers
      context.addToOfflineQueue({
        location: location,
        answers: Answers.filter((answer) => answer.answer != null),
        // converts the date to a standard epoch time
        createddate:
          typeof creationDate == 'number'
            ? creationDate
            : new Date(creationDate).getTime(),
        projectid: context.ProjectID,
        ispublic: !PrivatePoint,
      });
    } else {
      // if there are any difference in answers we must send it to the server
      const newAnswers = SavedAnswers.filter((savedAnswer) => {
        const indexOfAns = Answers.findIndex(
          (answer) => answer.questionid === savedAnswer.questionID
        );
        const answerOne = Answers[indexOfAns].answer;
        const answerTwo = savedAnswer.answer;
        const differentOfLarger =
          answerOne.length > answerTwo.length
            ? _.difference(answerOne, answerTwo)
            : _.difference(answerTwo, answerOne);
        return answerOne != answerTwo;
      }).map((diffAnswer) => {
        const diffIndex = Answers.findIndex(
          (answer) => answer.questionid === diffAnswer.questionID
        );
        return {
          answerID: diffAnswer.answerID,
          answer: Answers[diffIndex].answer,
        };
      });
      context.addToOfflineQueue({
        location: location,
        locationID: locationID,
        answers: newAnswers.filter((answer) => answer.answer != null),
        projectid: context.ProjectID,
        ispublic: !PrivatePoint,
      });
    }
    NavigationService.navigate('Map', {
      projectName: context.ProjectName,
    });
  };
  const finishQuestion = (ID, ismandatory) => {
    // if we finish a question again (or edit it) the status should be the same
    if (!CompleteQuestions.includes(ID) && !CompleteManQuestions.includes(ID)) {
      // if mandatory then we need to mark it finished
      if (ismandatory) {
        setCompleteManQuestions((CompleteManQuestions) => [
          ...CompleteManQuestions,
          ID,
        ]);

        setProgress(
          Math.round(
            ((CompleteManQuestions.length + 1) /
              Questions.filter((questions) => questions.ismandatory).length) *
            100
          )
        );
      } else {
        setCompleteQuestions((CompleteQuestions) => [...CompleteQuestions, ID]);
      }
    }
  };

  // if the use removes an answer, we must set remove it from completed
  const unfinishQuestion = (ID, ismandatory) => {
    if (CompleteQuestions.includes(ID) || CompleteManQuestions.includes(ID)) {
      if (ismandatory) {
        setCompleteManQuestions(
          CompleteManQuestions.filter((value) => value != ID)
        );
        setProgress(
          Math.round(
            ((CompleteManQuestions.length - 1) /
              Questions.filter((questions) => questions.ismandatory).length) *
            100
          )
        );
      } else {
        setCompleteQuestions(CompleteQuestions.filter((value) => value != ID));
      }
    }
  };

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // when the component is mounted
  useEffect(() => {
    // we pull in all questions for this project
    if (Questions.length <= 0) {
      processQuestData(context.ProjectID, context.AuthToken).then((results) => {
        setQuestions(results);
        // if there are no manditory questions no need to force any questions
        if (
          results.filter((questions) => questions.ismandatory).length === 0 &&
          progress !== 100
        )
          setProgress(100);

        // prepare answer object
        results.map((question) => {
          // for each answer, we should have some information about it
          setAnswers((Answers) => [
            ...Answers,
            {
              questionid: question.questionid,
              answer: '',
              createdby: question.createdby,
            },
          ]);
        });

        // if a locationID is present, the user is editing submited data
        // so we must pull in their previous answers
        if (locationID != null && SavedAnswers.length == 0) {
          loadAnswers(results);
        }
      });

      // getQuestionsData(context.ProjectID, context.AuthToken).then((results) => {
      //   setQuestionsData(results);


      //   });

    }
  }, []);

  // whenever progress is updated, we must Animate it
  useEffect(() => {
    Animated.timing(animation.current, {
      useNativeDriver: false,
      toValue: progress,
      duration: 100,
    }).start();
  }, [progress]);

  const loadAnswers = (QuestionAns) => {
    processAnswerData(locationID, context.AuthToken)
      .then((results) => {
        results.result.map((answerObj) => {
          // if the private point value from location table, passed by navigation
          setPrivatePoint(props.navigation.getParam('isPrivate', false));

          // set the answers for the user to edit
          let newAnswerObj = QuestionAns;
          const indexOfQuestion = QuestionAns.findIndex(
            (answer) => answer.questionid === answerObj.questionid
          );
          newAnswerObj[indexOfQuestion].answer = answerObj.answer;

          setAnswers(newAnswerObj);

          // mark all the question complete
          setCompleteManQuestions((CompleteManQuestions) => [
            ...CompleteManQuestions,
            answerObj.questionid,
          ]);

          // save old answers to compare to later
          setSavedAnswers((SavedAnswers) => [
            ...SavedAnswers,
            {
              questionID: answerObj.questionid,
              answerID: answerObj.answerid,
              answer: answerObj.answer,
            },
          ]);
        });
      })
      .then((res) => {
        // set progress to 100 just incase
        setProgress(100);
      });
  };

  const CurrentPointData = Questions.filter(
    (question) => question.questionid === CurrentQuestion
  );

  return (
    <SafeAreaView style={styles.container}>
      <Container>
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
          <React.Fragment>
            {
              // during creation, we can allow for them to pick this date
              locationID == null && (
                <ListItem>
                  <Left>
                    <Text style={styles.questionDesc}>
                      Select Creation Date:
                    </Text>
                  </Left>
                  <Body>


                    <Button
                      style={{
                        padding: 20,
                        flex: 1,
                        display: 'flex',
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        showDatePicker();
                      }}
                    >
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'blue' }}>
                        {creationDate ? creationDate.toLocaleDateString() : 'No date selected'}
                      </Text>
                      {/* <Text style={{ color: 'white' }}>Show Date</Text> */}
                    </Button>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      date={creationDate}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />


                    {/* <DatePicker
                      value={selectedDate}
                      defaultDate={new Date()}
                      locale={'en'}
                     // date={selectedDate}
                      ref={DatepickerRef}
                      textStyle={{ color: 'blue' }}
                      animationType={'fade'}
                      formatChosenDate={(date) => {
                        return Moment(date).format('LL');
                      }}
                     
                      onDateChange={saveDate}
                      onChange={onChangeMINE}
                    /> */}

                  </Body>
                </ListItem>
              )
            }
            <ListItem>
              <Left>
                <Text style={styles.questionDesc}>
                  Do not make data visible to all users:
                </Text>
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
          {Questions.map((question, index) => {

            // console.log("Question-----------------------------------------------------------------",question);
            // cache the image, could be swapped out for a cache management to avoid flickering
            if (question.imageurl != '0' && Platform.OS !== 'ios')
              Image.prefetch(question.imageurl).catch((err) => {
                return null;
              });
            return (
              <ListItem
                thumbnail
                key={index}
                onPress={() => {
                  handleQuestion(question.questionid);
                }}
              >
                <Left>
                  <Thumbnail
                    square
                    source={
                      question.imageurl != '0'
                        ? { uri: question.imageurl, cache: 'force-cache' }
                        : require('../../../assets/treehouse-default.png')
                    }
                  />
                </Left>
                <Body>
                  <Text numberOfLines={1} style={styles.questionDesc}>
                    {question.name} question
                    {question.ismandatory && (
                      <Text style={styles.required}> *</Text>
                    )}
                  </Text>
                  <Text numberOfLines={1} style={styles.questionB}>
                    {question.question}
                    {question.ismandatory}
                  </Text>
                </Body>
                <Right
                  style={[
                    styles.rightStyling,
                    {
                      borderColor:
                        CompleteQuestions.includes(question.questionid) ||
                          CompleteManQuestions.includes(question.questionid)
                          ? 'green'
                          : 'red',
                    },
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
            <Text style={{ color: 'white' }}>Complete</Text>
          </Button>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  required: {
    color: 'red',
    fontWeight: 'bold',
  },
  questionList: {
    paddingTop: 1,
  },
  questionDesc: {
    fontWeight: 'bold',
    padding: 5,
  },
  questionB: {
    padding: 7,
  },
  answerBtn: {
    color: 'blue',
  },
  completeBtn: {
    justifyContent: 'center',
    margin: 10,
    marginTop: 20,
  },
  rightStyling: {
    borderRightWidth: 10,
    borderBottomColor: '#ccc',
    marginBottom: 1,
    marginTop: 1,
  },
});
