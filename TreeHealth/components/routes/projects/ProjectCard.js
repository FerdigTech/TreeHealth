import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Image } from "react-native";
import { Text, Card, CardItem, Container } from "native-base";
import NavigationService from "../../../NavigationService";


export class ProjectCard extends React.Component {
  render() {
    var img = this.props.defaultImg
      ? require("../../../assets/treehouse-default.png")
      : require("../../../assets/treehouse-default.png");
    return (
      <Card>
        <CardItem
          cardBody
          button
          onPress={()=> NavigationService.navigate("Map", {
              projectName: this.props.projectName,
              projectID: this.props.projectID
            })
          }
        >
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
    );
  }
}

ProjectCard.propTypes = {
  defaultImg: PropTypes.bool.isRequired,
  projectName: PropTypes.string.isRequired,
  projectID: PropTypes.number.isRequired,
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
