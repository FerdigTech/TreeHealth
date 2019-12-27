import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Button
} from "react-native";
import { Icon, Text, ListItem } from "native-base";
import Modal from "react-native-modal";
import { ProjectCosumer } from "./../../ProjectProvider";

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
              <TouchableOpacity
                onPress={() => props.handleUpdate(project.name)}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.ProjectTxt}
                >
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
    <View style={{ flex: 1 }}>
      <Modal
        onSwipeThreshold={750}
        onSwipeComplete={() => this.toggleDropVis()}
        swipeDirection="down"
        isVisible={DropDownVisible}
        scrollHorizontal={true}
        style={{ margin: 0 }}
      >
        <ScrollView style={styles.dropLst}>
          <Button onPress={() => this.toggleDropVis()} title={"Close"} />
          <ProjectLst
            handleUpdate={this.setProjectName}
            projectName={ProjectName}
          />
        </ScrollView>
      </Modal>
    </View>
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
    alignContent: "center",
    height: "100%"
  },
  ProjectTxt: {
    flexDirection: "row",
    alignItems: "center"
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
