import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Text } from "native-base";
import { List, ListItem } from "native-base";

export class TitleDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyDropd: false
    };
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.toggleDropDown()}
        style={styles.dropContr}
        activeOpacity={0.7}
      >
        <View style={styles.dropWrap}>
          <Text style={styles.projectTitle}>{this.props.projectName}</Text>
          <Icon
            name={this.state.currentlyDropd ? "arrow-up" : "arrow-down"}
            style={styles.dropIcon}
          />
        </View>
        {this.state.currentlyDropd && <ScrollDrop />}
      </TouchableOpacity>
    );
  }

  toggleDropDown() {
    this.setState({ currentlyDropd: !this.state.currentlyDropd });
  }
}

TitleDrop.propTypes = {
  projectName: PropTypes.string.isRequired
};

export class ScrollDrop extends React.Component {
  render() {
    return (
      <View style={styles.dropLst}>
        <List>
          <ListItem>
            <Text numberOfLines={1} ellipsizeMode="tail">
              Project 2
            </Text>
          </ListItem>
          <ListItem>
            <Text>Project 3</Text>
          </ListItem>
          <ListItem>
            <Text>Project 4</Text>
          </ListItem>
        </List>
      </View>
    );
  }
}

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
