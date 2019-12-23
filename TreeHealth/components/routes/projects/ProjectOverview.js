import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar
} from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container, Content } from "native-base";
import { ProjectCosumer } from "./../../../ProjectProvider";

export function ProjectsEl() {
  return (
    <ProjectCosumer>
      {context =>
        context.Projects.map((project, index) => {
          return (
            <ProjectCard
              projectID={project.ProjectID}
              projectName={project.name}
              defaultImg={true}
              projectSummary={project.description}
              key={index}
            />
          );
        })
      }
    </ProjectCosumer>
  );
}

export class ProjectOverview extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <StatusBar
            style={styles.statusBar}
            backgroundColor="blue"
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1 }}>
            <ProjectsEl />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

ProjectOverview.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === "ios" ? 20 : 0,
    zIndex: 3
  }
});
