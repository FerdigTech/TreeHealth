import React from "react";
import { ScrollView, Image, StyleSheet } from "react-native";
import {
  Container,
  Content,
  Text,
  ListItem,
  Left,
  Body,
  Right
} from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop, ProjectsModalDrop } from "./../../reusable/TitleDrop";
import NavigationService from "../../../services/NavigationService";
import { ProjectCosumer } from "../../../context/ProjectProvider";

function PointsLstEl() {
  var img = require("../../../assets/treehouse-default.png");
  return (
    <ProjectCosumer>
      {context =>
        context.Points.map((point, index) => {
          return (
            <ListItem key={index}>
              <Left>
                <Image source={img} style={styles.headerImg} />
              </Left>
              <Body>
                <Text
                  llipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.titleTxt}
                >
                  {point.properties.title}
                </Text>
              </Body>
              <Right />
            </ListItem>
          );
        })
      }
    </ProjectCosumer>
  );
}

export class PointsStacked extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => (
      <TitleDrop
        navigation={navigation}
        projectName={navigation.getParam("projectName", "All")}
      />
    )
  });
  constructor(props) {
    super(props);
    this.state = {
      currentProject: this.props.navigation.getParam("projectName", "All")
    };
  }
  render() {
    return (
      <Container>
        <Content>
          <ProjectsModalDrop navigation={this.props.navigation} />
          <ScrollView style={{ flex: 1 }}>
            <PointsLstEl />
          </ScrollView>
        </Content>
        <FooterTabs
          listIcon="compass"
          switchView={() => NavigationService.navigate("Map")}
          funnelToggle={() => {}}
          SearchToggle={() => {}}
          addItemAction={() =>
            NavigationService.navigate("QuestionList", {
              projectName: this.state.currentProject
            })
          }
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerImg: {
    height: 40,
    width: 40,
    flex: 1
  },
  titleTxt: {
    fontWeight: "bold",
    fontSize: 16
  }
});
