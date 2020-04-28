import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from "react-native";
import { List, Button, ListItem } from "native-base";
import { processAnswerData } from "./../../services/FetchService";

import Modal from "react-native-modal";

export const AnswerModal = ({ navigation, locationid, closeModal }) => {

  const [answers, setAnswers] = useState([])

  useEffect(() => {

    processAnswerData(locationid, "callout").then(results => {
      setAnswers(results.result);
    });

    return () => {
      closeModal();
    };
  }, [locationid]);
  
  return (
    <View style={{ flex: 1 }}>
      <Modal
        onBackButtonPress={() => closeModal()}
        isVisible={locationid !== null}
        scrollHorizontal={true}
        style={{ margin: 0 }}
      >
        <SafeAreaView>
          <ScrollView style={styles.dropLst}>
            <Button danger block onPress={() => closeModal()}>
              <Text style={{ color: "white" }}>Close</Text>
            </Button>
            <List>
            <ListItem>
              <Text style={styles.divingTxt}>Answers:</Text>
            </ListItem>
            {answers.sort((a, b) => a.displayorder - b.displayorder).map((answerObj, index) => {
              return (
                <React.Fragment key={index}>
                  {!Array.isArray(answerObj.answer) && answerObj.answer.startsWith("http", 0) ? (
                      <Image
                        style={styles.modalImg}
                        source={{uri: answerObj.answer}}
                      />
                    ) : (
                      <ListItem>
                        <Text>{answerObj.answer}</Text>
                      </ListItem>
                  )}
                </React.Fragment>
              )
            })}
            </List>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropLst: {
    backgroundColor: "white",
    alignContent: "center",
    height: "100%"
  },
  divingTxt: {
    fontWeight: "bold"
  },
  modalImg: {
    width: "90%",
    margin: "5%",
    paddingTop: "100%",
    flex: 1,
  }
});
