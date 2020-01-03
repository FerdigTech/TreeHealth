import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, SafeAreaView, Text, View } from "react-native";
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

export const PointQuestions = () => {
  const [Questions, setQuestions] = useState([]);

  useEffect(() => {
    processQuestData(-1).then(results => {
      setQuestions(results);
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text>Other</Text>
        {Questions.map((question, index) => {
          return (
            <View key={index}>
              <Text>{question.Description}</Text>
              <Text>{question.Question}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ccc"
  }
});
