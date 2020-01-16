import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Card, CardItem } from "native-base";
import NavigationService from "../../../services/NavigationService";

export class ProjectCard extends React.Component {
  render() {
    var img = this.props.defaultImg
      ? require("../../../assets/treehouse-default.png")
      : require("../../../assets/treehouse-default.png");
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          // prevents from actions during demo
          if (this.props.projectID != null) {
            this.props.setProjectID(this.props.projectID);
            NavigationService.navigate("Map", {
              projectName: this.props.projectName
            });
          }
        }}
      >
        <Card>
          <CardItem cardBody>
            <Image source={img} style={styles.headerImg} />
          </CardItem>
          <CardItem>
            <Text style={styles.titleTxt}>{this.props.projectName}</Text>
          </CardItem>
          <CardItem>
            <Text style={styles.summaryTxt} note>
              {this.props.projectSummary}
            </Text>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }
}

ProjectCard.propTypes = {
  defaultImg: PropTypes.bool.isRequired,
  projectName: PropTypes.string,
  projectSummary: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  headerImg: {
    height: 200,
    width: null,
    flex: 1
  },
  titleTxt: {
    fontWeight: "bold",
    fontSize: 16
  },
  summaryTxt: {}
});
