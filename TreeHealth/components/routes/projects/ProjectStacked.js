import React from "react";
import { ScrollView } from "react-native";
import { Container, Content } from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop, ProjectsModalDrop } from "./../../reusable/TitleDrop";
import NavigationService from "../../../NavigationService";

export class ProjectStacked extends React.Component {
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
          <ScrollView style={{ flex: 1 }} />
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
