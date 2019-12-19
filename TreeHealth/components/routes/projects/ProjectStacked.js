import React from "react";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";
import { Container, Content } from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop } from "./../../reusable/TitleDrop";

export class ProjectStacked extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => (
      <TitleDrop projectName={navigation.getParam("projectName", "All")} />
    )
  });
  constructor(props) {
    super(props);
    this.state = {
      currentProject: this.props.navigation.getParam("projectName", "All")
    };
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }} />
        </Content>
        <FooterTabs
          listIcon="compass"
          switchView={() => navigate("Map")}
          funnelToggle={() => {}}
          SearchToggle={() => {}}
          addItemAction={() =>
            navigate("QuestionList", {
              projectName: this.state.currentProject
            })
          }
        />
      </Container>
    );
  }
}

ProjectStacked.propTypes = {
  navigation: PropTypes.object.isRequired
};