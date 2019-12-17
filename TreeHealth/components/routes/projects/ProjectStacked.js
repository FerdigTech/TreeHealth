import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Container, Content } from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";

export class ProjectStacked extends React.Component {
  static navigationOptions = {
    title: "Projects name"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }} />
        </Content>
        <FooterTabs
          listIcon="compass"
          switchView={() => navigate("Map")}
          funnelToggle={() => {}}
          SearchToggle={() => {}}
          addItemAction={() =>  navigate("QuestionList")}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
