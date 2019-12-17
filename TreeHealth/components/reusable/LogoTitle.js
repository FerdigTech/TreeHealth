import React from "react";
import { Image, StyleSheet } from "react-native";

export class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require("./../../assets/logo.png")}
        resizeMode={"contain"}
        style={styles.titleImg}
      />
    );
  }
}
const styles = StyleSheet.create({
  titleImg: {
    height: 30,
    marginLeft: "auto",
    marginRight: "auto"
  }
});
