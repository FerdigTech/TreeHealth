import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ProjectItem } from "./ProjectItem";
import { Container, Content } from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";

export class ProjectList extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }}>
            <ProjectItem isDraft={true} />
            <ProjectItem isDraft={false} />
          </ScrollView>
        </Content>
        <FooterTabs
          listIcon="compass"
          switchView={() => navigate("Map")}
          funnelToggle={() => {}}
          SearchToggle={() => {}}
          addItemAction={() => {}}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
