import React from "react";
import { ScrollView } from "react-native";
import { QuestionItem } from "./QuestionItem";
import { Container, Content } from "native-base";

export class QuestionList extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }}>
            <QuestionItem isDraft={true} />
            <QuestionItem isDraft={false} />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
