import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, ScrollView, Platform, StatusBar } from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container, Content } from "native-base";
import globals from "../../../globals";

export class ProjectOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }
  // this is for the fetch await and async component mount
  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }
  // Get all the map points from the site
  async componentDidMount() {
    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(true);
    }

    let projects = await fetch(globals.SERVER_URL + "/projects/")
      .then(response => response.json())
      .catch(function(error) {
        console.log(error.message);
        throw error;
      });
    
    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }

    // TODO: if offline, should try to pull project information from local information

    await this.setStateAsync({ projects: ((projects !== "undefined") ? projects : []) });
  }
  render() {
    const projectsEl = this.state.projects.map((project, index) => {
      return (
        <ProjectCard
          projectName={project.title}
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
            {projectsEl}
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
