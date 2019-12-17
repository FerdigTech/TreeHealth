import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container, Content } from "native-base";

export class ProjectOverview extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }}>
            <ProjectCard
              projectName={"Beech Leaf Disease Training"}
              defaultImg={true}
              projectSummary={"fsdfsdfsd"}
              navigation={this.props.navigation}
            />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
