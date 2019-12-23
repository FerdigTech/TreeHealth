import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Text
} from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container, Content } from "native-base";
import globals from "../../../globals";
import { ProjectCosumer } from "./../../../ProjectProvider";

export function DataEl() {
  return (
    <ProjectCosumer>
      {context => <Text>Data: {context.Projects.length}</Text>}
    </ProjectCosumer>
  );
}

export class ProjectOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }
  // Get all the projects from the site
  componentDidMount() {
    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(true);
    }

    fetch(globals.SERVER_URL + "/projects/")
      .then(response => response.json())
      .then(response =>
        this.setState({ projects: response !== "undefined" ? response : [] })
      )
      .catch(function(error) {
        console.log(error.message);
        throw error;
      });

    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }

    // TODO: if offline, should try to pull project information from local information
    // TODO: projects should be set globally, so other components could use it
  }
  render() {
    const projectsEl = this.state.projects.map((project, index) => {
      return (
        <ProjectCard
          projectID={project.ProjectID}
          projectName={project.name}
          defaultImg={true}
          projectSummary={project.description}
          navigation={this.props.navigation}
          key={index}
        />
      );
    });

    return (
      <Container>
        <Content>
          <StatusBar
            style={styles.statusBar}
            backgroundColor="blue"
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1 }}>
            <DataEl />
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
