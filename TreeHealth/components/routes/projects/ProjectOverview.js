import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, ScrollView, Platform, StatusBar } from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container, Content } from "native-base";
import { getProjectLstInfo } from "../../../pointFunc";

export class ProjectOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: []
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

    let geoJSON_values = await fetch(
      "https://127.0.0.1:8000/Indexpoints.geojson"
    )
      .then(response => response.json())
      .catch(function(error) {
        console.log(error.message);
        return [];
      });

    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    await this.setStateAsync({ geoJSON_values: geoJSON_values });
  }
  render() {
    // Handles to see if GeoJson format exists, otherwise returns empty
    let projectInfo = [];
    if (typeof this.state.geoJSON_values !== "undefined") {
      projectInfo = this.state.geoJSON_values.hasOwnProperty("features")
        ? getProjectLstInfo(this.state.geoJSON_values)
        : [];
    }
    const projects = projectInfo.map((project, index) => {
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
          <ScrollView style={{ flex: 1 }}>{projects}</ScrollView>
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
