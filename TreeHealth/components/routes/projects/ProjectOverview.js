import React from "react";
import PropTypes from "prop-types";
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

ProjectOverview.propTypes = {
  navigation: PropTypes.object.isRequired
};

