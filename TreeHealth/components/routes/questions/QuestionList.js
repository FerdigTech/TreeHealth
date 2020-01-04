import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { QuestionItem } from "./QuestionItem";
import { Container, Content } from "native-base";

export const QuestionList = () => {
  return (
    <Container>
      <Content>
        <ScrollView style={{ flex: 1 }}>
          <QuestionItem indexVal={1} isDraft={true} />
          <QuestionItem indexVal={2} isDraft={false} />
        </ScrollView>
      </Content>
    </Container>
  );
};

QuestionList.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate("AddPoint")}>
      <Text style={styles.NavText}>Add Record</Text>
    </TouchableOpacity>
  )
});

const styles = StyleSheet.create({
  NavText: {
    color: "white",
    paddingRight: 10
  }
});
