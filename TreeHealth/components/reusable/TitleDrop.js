import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Text } from "native-base";

export class TitleDrop extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => {}} style={styles.dropContr} activeOpacity={0.7}>
        <View style={styles.dropWrap}>
          <Text style={styles.projectTitle}>{this.props.projectName}</Text>
          <Icon name="arrow-down" style={styles.dropIcon} />
        </View>
      </TouchableOpacity>
    );
  }
}

TitleDrop.propTypes = {
  projectName: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
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
