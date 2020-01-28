import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Button, Text, Icon, Form, Item, Picker, Textarea } from "native-base";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import SelectMultiple from "react-native-select-multiple";

const ImageAnswer = props => {
  let imagePath = "";
  if (props.savedValue != "") {
    // if it is a link
    if (props.savedValue.startsWith("http", 0)) {
      Image.prefetch(props.savedValue);
      imagePath = props.savedValue;
    } else {
      imagePath = "data:image/png;base64," + props.savedValue;
    }
  }
  return (
    <View style={styles.ImageAnswer}>
      {imagePath != "" && (
        <Image
          source={{
            uri: imagePath
          }}
          // 3x4 since the pictures are 3x4
          style={styles.currentImg}
        />
      )}
      <Button
        style={styles.ImageAnsBtn}
        onPress={() => props.handleCamera(() => props.handleSave)}
        iconLeft
        round
      >
        <Icon name="camera" />
        <Text>Use Camera</Text>
      </Button>
      <Button
        style={styles.ImageAnsBtn}
        onPress={() => props.handlePicker(() => props.handleSave)}
        iconLeft
        round
      >
        <Icon name="images" />
        <Text>Select from gallary</Text>
      </Button>
    </View>
  );
};

const MultipleChoice = props => {
  useEffect(() => {
    if (props.savedValue == "") {
      props.handleSave([]);
    }
  }, []);
  const { options } = props;

  return (
    <Form>
      <Item>
        <SelectMultiple
          items={options}
          // strip out label that is returned by the component
          onSelectionsChange={value =>
            props.handleSave(value.map(({ value }) => value))
          }
          selectedItems={
            Array.isArray(props.savedValue)
              ? // rebuild the answer to be properly be an object
                props.savedValue.map(value => ({ label: value, value: value }))
              : []
          }
        />
      </Item>
    </Form>
  );
};

const TextInput = props => {
  useEffect(() => {
    if (props.savedValue.length <= 0 || props.savedValue == "") {
      props.handleSave("");
    }
  }, []);
  return (
    <Form>
      <Item>
        <Textarea
          style={styles.textInput}
          rowSpan={5}
          bordered
          value={props.savedValue}
          onChangeText={value => props.handleSave(value.toString())}
          placeholder="Type your answer"
        />
      </Item>
    </Form>
  );
};

const DropDown = props => {
  const { options } = props;
  useEffect(() => {
    if (props.savedValue == 0 || props.savedValue == "") {
      props.handleSave(0);
    }
  }, []);
  return (
    <Form>
      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: undefined }}
          placeholder="Select your answer"
          placeholderStyle={{ color: "#ccc" }}
          placeholderIconColor="black"
          selectedValue={
            props.savedValue == "" ? 0 : parseInt(props.savedValue)
          }
          onValueChange={value => props.handleSave(value.toString())}
        >
          {options.map((option, index) => {
            return (
              <Picker.Item
                label={option.toString()}
                key={index}
                value={index}
              />
            );
          })}
        </Picker>
      </Item>
    </Form>
  );
};

export const QuestionModal = props => {
  const [Answer, setAnswer] = useState("");
  const [ImagleViewable, setImagleViewable] = useState(false);
  const { question, options, questiontype, image, questionid } =
    props.QuestionData.length > 0
      ? props.QuestionData[0]
      : {
          question: "",
          options: "",
          questiontype: "",
          image: "",
          questionid: -1
        };
  useEffect(
    () => {
      // on load, we should set the answer back to what we got previously
      if (
        props.ShowModal &&
        typeof props.currentAnswers[questionid] !== "undefined"
      ) {
        setAnswer(props.currentAnswers[questionid]);
      }
    },
    [props.ShowModal]
  );

  const beforeClose = () => {
    // save the answer
    props.handleSave(Answer);
    // reset the value on head
    setAnswer("");
  };
  return (
    // TODO: Add a time picker, so that users can edit their time
    <View style={{ flex: 1 }}>
      <Modal
        visible={props.ShowModal}
        scrollHorizontal={true}
        style={styles.mainModal}
      >
        <ScrollView style={styles.ModalView}>
          <Button
            danger
            block
            onPress={() => beforeClose()}
            style={styles.CloseBtn}
          >
            <Text style={styles.CloseBtnTxt}>Submit Progress</Text>
          </Button>
          <ScrollView style={styles.ModalContent}>
            <Button info style={styles.QuestionIcon}>
              <Icon style={styles.QuestionIconTxt} name="information" />
            </Button>
            {question != "" && (
              <Text type={styles.QuestionTxt}>{question}</Text>
            )}
            {questiontype != "Image" && (
              <React.Fragment>
                <Button
                  block
                  rounded
                  style={styles.imageBtn}
                  onPress={() => setImagleViewable(!ImagleViewable)}
                >
                  <Text style={{ color: "white" }}>
                    {ImagleViewable ? "Hide" : "View"} Image
                  </Text>
                </Button>
                <Modal
                  style={styles.imgModal}
                  visible={ImagleViewable}
                  transparent={false}
                  onRequestClose={() => setImagleViewable(false)}
                >
                  <ImageViewer
                    enableSwipeDown={true}
                    swipeDownThreshold={200}
                    onSwipeDown={() => setImagleViewable(false)}
                    imageUrls={[{ url: image }]}
                  />
                </Modal>
              </React.Fragment>
            )}

            {(questiontype == "multiple-choice" && (
              <MultipleChoice
                options={options}
                savedValue={Answer}
                handleSave={setAnswer}
              />
            )) ||
              (questiontype == "Text" && (
                <TextInput
                  options={options}
                  savedValue={Answer}
                  handleSave={setAnswer}
                />
              )) ||
              (questiontype == "Dropdown" && (
                <DropDown
                  options={options}
                  savedValue={Answer}
                  handleSave={setAnswer}
                />
              )) ||
              (questiontype == "Image" && (
                <ImageAnswer
                  handlePicker={props.handlePicker}
                  handleCamera={props.handleCamera}
                  savedValue={Answer}
                  handleSave={setAnswer}
                />
              ))}
          </ScrollView>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ModalView: {
    backgroundColor: "white",
    height: "100%"
  },
  QuestionIcon: {
    backgroundColor: "blue",
    color: "white",
    height: 48,
    width: 48,
    borderRadius: 48,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10
  },
  QuestionIconTxt: {
    marginLeft: 0,
    marginRight: 0,
    fontSize: 44
  },
  imageBtn: {
    justifyContent: "center",
    margin: 10,
    marginTop: 20
  },
  QuestionTxt: {},
  ModalContent: {
    margin: 10
  },
  CloseBtnTxt: {
    textAlign: "center",
    color: "white"
  },
  CloseBtn: {
    marginBottom: 5
  },
  mainModal: {
    margin: 0,
    zIndex: 5
  },
  imgModal: {
    zIndex: 10
  },
  textInput: {
    width: "100%"
  },
  ImageAnswer: {
    alignSelf: "center",
    padding: 10
  },
  currentImg: {
    height: 300,
    width: 225,
    marginBottom: 10
  },
  ImageAnsBtn: {
    marginBottom: 10,
    marginTop: 10
  }
});
