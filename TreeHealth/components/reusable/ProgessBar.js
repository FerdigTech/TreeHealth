import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import globals from "../../globals";

export const ProgressBar = props => {
  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={
          ([StyleSheet.absoluteFill],
          { backgroundColor: globals.COLOR.GREEN, width: props.progress })
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  progressBar: {
    flexDirection: "row",
    height: 20,
    width: "100%",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0
  }
});
