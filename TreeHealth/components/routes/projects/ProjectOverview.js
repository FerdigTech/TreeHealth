import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container } from "native-base";

export class ProjectOverview extends React.Component {
  render() {
    return (
      <Container>
        <ScrollView style={{ flex: 1 }}>
          <ProjectCard />
          <ProjectCard />
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
