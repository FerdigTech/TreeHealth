import React from "react";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";
import { QuestionItem } from "./QuestionItem";
import { Container, Content } from "native-base";
import NavigationService from "../../../NavigationService";

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
