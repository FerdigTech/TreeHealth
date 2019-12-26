import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button
} from "react-native";
import { Icon, Text, ListItem, List } from "native-base";
import { ProjectCosumer } from "./../../ProjectProvider";
import NavigationService from "../../NavigationService";

// creats a list of the projects who aren't active
const ProjectLst = props => {
  return (
    <ProjectCosumer>
      {context =>
        context.Projects.filter(
          project => project.name != props.projectName
        ).map((project, index) => {
          return (
            <ListItem key={index}>
              <TouchableOpacity onPress={() => props.handleUpdate(project.name)}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  {project.name}
                </Text>
              </TouchableOpacity>
            </ListItem>
          );
        })
      }
    </ProjectCosumer>
  );
};
export const ProjectsModalDrop = props => {
  setProjectName = updatedProject => {
    props.navigation.setParams({
      projectName: updatedProject
    });
    toggleDropVis();
  };
  toggleDropVis = () => {
    const DropDownVisible = props.navigation.getParam("DropDownVisible");

    props.navigation.setParams({
      DropDownVisible: !DropDownVisible
    });
  };
  // defaults to keeping the modal closed
  const DropDownVisible = props.navigation.getParam("DropDownVisible", false);
  const ProjectName = props.navigation.getParam("projectName", "All");
  return (
    <Modal style={styles.markerModal} visible={DropDownVisible}>
      <Button onPress={() => this.toggleDropVis()} title={"Close"} />
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        style={styles.dropLst}
      >
        <ProjectLst handleUpdate={this.setProjectName} projectName={ProjectName} />
      </ScrollView>
    </Modal>
  );
};

export class TitleDrop extends React.Component {
  toggleDropVis = () => {
    const DropDownVisible = this.props.navigation.getParam("DropDownVisible");

    this.props.navigation.setParams({
      DropDownVisible: !DropDownVisible
    });
  };
  render() {
    const DropDownVisible = this.props.navigation.getParam("DropDownVisible");
    return (
      <View style={styles.dropContr}>
        <TouchableOpacity
          onPress={() => this.toggleDropVis()}
          activeOpacity={0.7}
        >
          <View style={styles.dropWrap}>
            <Text style={styles.projectTitle}>{this.props.projectName}</Text>
            <Icon
              name={DropDownVisible ? "arrow-up" : "arrow-down"}
              style={styles.dropIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

TitleDrop.propTypes = {
  projectName: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  dropLst: {
    backgroundColor: "white",
    position: "absolute",
    top: 38,
    zIndex: 2
  },
  dropContr: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  dropWrap: {
    flexDirection: "row",
    alignItems: "center"
  },
  projectTitle: {
    color: "white",
    fontWeight: "bold"
  },
  dropIcon: {
    color: "white",
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4
  }
});
