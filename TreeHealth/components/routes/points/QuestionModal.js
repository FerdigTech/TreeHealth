import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image, Dimensions } from "react-native";
import { Button, Text, Icon, Form, Input, Item, Picker, Textarea } from "native-base";
import Modal from "react-native-modal";

const MultipleChoice = props => {
  return (
    <Item>
      <Input />
    </Item>
  );
};

const TextInput = props => {
  return (
    <Item>
      <Textarea rowSpan={5} bordered placeholder="Textarea" />
    </Item>
  );
};

const DropDown = props => {
  const { options } = props;
  return (
    <Item picker>
      <Picker
        mode="dropdown"
        iosIcon={<Icon name="arrow-down" />}
        style={{ width: undefined }}
        placeholder="Select your answer"
        placeholderStyle={{ color: "#ccc" }}
        placeholderIconColor="black"
        selectedValue={props.savedValue == "" ? 0 : parseInt(props.savedValue)}
        onValueChange={value => props.handleSave(value.toString())}
      >
        {options.map((option, index) => {
          return (
            <Picker.Item label={option.toString()} key={index} value={index} />
          );
        })}
      </Picker>
    </Item>
  );
};

export const QuestionModal = props => {
  const [Answer, setAnswer] = useState("");
  const { Question, Options, QuestionType, image } =
    props.QuestionData.length > 0
      ? props.QuestionData[0]
      : {
          Question: "",
          Options: "",
          QuestionType: "",
          image: ""
        };
  return (
    <View style={{ flex: 1 }}>
      <Modal
        onSwipeThreshold={750}
        onSwipeComplete={() => props.handleSave(Answer)}
        swipeDirection="down"
        isVisible={props.ShowModal}
        scrollHorizontal={true}
        style={{ margin: 0 }}
      >
        <ScrollView style={styles.ModalView}>
          <Button
            danger
            block
            onPress={() => props.handleSave(Answer)}
            style={styles.CloseBtn}
          >
            <Text style={styles.CloseBtnTxt}>Submit Progress</Text>
          </Button>
          <ScrollView style={styles.ModalContent}>
            <Button info style={styles.QuestionIcon}>
              <Icon style={styles.QuestionIconTxt} name="information" />
            </Button>
            <Text type={styles.QuestionTxt}>{Question}</Text>
            <Button block rounded style={styles.imageBtn}>
              <Text style={{ color: "white" }}>View Image</Text>
            </Button>
            <Form>
              {(QuestionType == "multiple-choice" && (
                <MultipleChoice
                  options={Options}
                  savedValue={Answer}
                  handleSave={setAnswer}
                />
              )) ||
                (QuestionType == "Text" && (
                  <TextInput
                    options={Options}
                    savedValue={Answer}
                    handleSave={setAnswer}
                  />
                )) ||
                (QuestionType == "Dropdown" && (
                  <DropDown
                    options={Options}
                    savedValue={Answer}
                    handleSave={setAnswer}
                  />
                ))}
            </Form>
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
  }
});
