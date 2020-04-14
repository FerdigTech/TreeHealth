import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";

export const TitleDrop = props => {
  return (
    <View style={styles.dropContr}>
      <View style={styles.dropWrap}>
        <Text
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={styles.projectTitle}
        >
          {props.projectName}
        </Text>
      </View>
    </View>
  );
};

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
    fontWeight: "bold",
    paddingLeft: 25,
    paddingRight: 25
  }
});
