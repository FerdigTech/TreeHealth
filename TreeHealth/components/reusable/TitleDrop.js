import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Text } from "native-base";
import { List, ListItem } from "native-base";
import { ProjectCosumer } from "./../../ProjectProvider";
import NavigationService from "../../NavigationService";

// creats a list of the projects who aren't active
const ProjectsLstEl = props => {
  return (
    <ProjectCosumer>
      {context =>
        context.Projects.filter(
          project => project.name != props.projectName
        ).map((project, index) => {
          return (
            <ListItem key={index}>
              <TouchableOpacity onPress={(e, data) => console.log("did it")}>
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

export class TitleDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyDropd: false
    };
  }

  render() {
    return (
      <View style={styles.dropContr}>
        <TouchableOpacity
          onPress={() => this.toggleDropDown()}
          activeOpacity={0.7}
        >
          <View style={styles.dropWrap}>
            <Text style={styles.projectTitle}>{this.props.projectName}</Text>
            <Icon
              name={this.state.currentlyDropd ? "arrow-up" : "arrow-down"}
              style={styles.dropIcon}
            />
          </View>
        </TouchableOpacity>
        {this.state.currentlyDropd && (
          <View style={styles.dropLst}>
            <List>
              <ProjectsLstEl projectName={this.props.projectName} />
            </List>
          </View>
        )}
      </View>
    );
  }

  toggleDropDown() {
    this.setState({ currentlyDropd: !this.state.currentlyDropd });
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
    zIndex: 5
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
