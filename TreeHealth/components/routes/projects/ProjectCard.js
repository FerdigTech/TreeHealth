import React from "react";
import { StyleSheet, Image } from "react-native";
import { Text, Card, CardItem, Container } from "native-base";

export class ProjectCard extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    var img = this.props.defaultImg
      ? require("../../../assets/treehouse-default.png")
      : require("../../../assets/treehouse-default.png");
    return (
      <Container>
        <Card>
          <CardItem cardBody button onPress={() => navigate("Map")}>
            <Image
              source={img}
              style={styles.headerImg}
            />
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
      </Container>
    );
  }
}

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
