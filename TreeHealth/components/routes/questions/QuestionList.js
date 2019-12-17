import React from "react";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";
import { QuestionItem } from "./QuestionItem";
import { Container, Content } from "native-base";

export class QuestionList extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
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

QuestionList.propTypes = {
  navigation: PropTypes.object.isRequired
};
