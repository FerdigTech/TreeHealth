import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, SafeAreaView, Text, View } from "react-native";
import { Container, Content, ListItem, Left, Right, Body, Thumbnail, Button } from "native-base";
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

const MultipleChoiceEl = () => {};

const ExtendedResponseEl = () => {};
const DropDownEl = () => {};

export const PointQuestions = () => {
  const [Questions, setQuestions] = useState([]);

  useEffect(() => {
    processQuestData(-1).then(results => {
      setQuestions(results);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <ScrollView>
            {Questions.map((question, index) => {
              return (
                <ListItem key={index} thumbnail>
                  <Left>
                    <Thumbnail square source={{ uri: question.image }} />
                  </Left>
                  <Body>
                    <Text numberOfLines={1} style={styles.questionDesc}>{question.Description}</Text>
                  </Body>
                  <Right>
                <Button transparent>
                  <Text style={styles.answerBtn}>Answer</Text>
                </Button>
              </Right>
                </ListItem>
              );
            })}
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
  questionDesc: {
    fontWeight: "bold",
    padding: 5
  },
  answerBtn: {
    color: "blue",
  }
});
