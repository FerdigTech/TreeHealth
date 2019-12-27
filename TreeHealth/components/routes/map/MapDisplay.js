import React from "react";
import MapView, {
  Marker,
  Callout,
  AnimatedRegion,
  Animated
} from "react-native-maps";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  TextInput
} from "react-native";
import { Container, Content } from "native-base";
import { MarkerModal } from "./MarkerModal";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop, ProjectsModalDrop } from "../../reusable/TitleDrop";
import NavigationService from "../../../NavigationService";
import { ProjectCosumer } from "./../../../ProjectProvider";

function PointsEl() {
  return (
    <ProjectCosumer>
      {context =>
        context.Points.map((point, index) => {
          return (
            <Marker
              coordinate={{
                longitude: point.geometry.coordinates[0],
                latitude: point.geometry.coordinates[1]
              }}
              title={point.properties.title}
              onPress={() => this.toggleModalVis()}
              key={index}
            />
          );
        })
      }
    </ProjectCosumer>
  );
}

export class MapDisplay extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => (
      <TitleDrop
        navigation={navigation}
        projectName={navigation.getParam("projectName", "All")}
      />
    )
  });
  // initalize the default values in state
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      showSearch: false,
      currentProjectID: this.props.navigation.getParam("ProjectID", "None"),
      currentProject: this.props.navigation.getParam("projectName", "All")
    };
  }
  toggleModalVis() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }
  toggleSearchVis() {
    this.setState({ showSearch: !this.state.showSearch });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          <Content>
            <Animated style={styles.mapStyle} initialRegion={zoomNEOhio.region}>
              <PointsEl />
            </Animated>
            <MarkerModal
              show={this.state.modalVisible}
              handleClose={() => this.toggleModalVis()}
            />
            <ProjectsModalDrop navigation={this.props.navigation} />
            {this.state.showSearch && (
              <Callout>
                <View style={styles.calloutView}>
                  <TextInput
                    style={styles.calloutSearch}
                    placeholder={"Search"}
                  />
                </View>
              </Callout>
            )}
          </Content>
          <FooterTabs
            listIcon="list"
            switchView={() =>
              NavigationService.navigate("ProjectStacked", {
                projectName: this.state.currentProject
              })
            }
            funnelToggle={() => {}}
            SearchToggle={() => this.toggleSearchVis()}
            addItemAction={() =>
              NavigationService.navigate("QuestionList", {
                projectName: this.state.currentProject
              })
            }
          />
        </Container>
      </SafeAreaView>
    );
  }
}

const zoomNEOhio = {
  region: new AnimatedRegion({
    latitude: 41.215078,
    longitude: -81.562843,
    latitudeDelta: 3 / 4,
    longitudeDelta: 3 / 4
  })
};

const styles = StyleSheet.create({
  calloutView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    width: "40%",
    marginLeft: "30%",
    marginRight: "30%",
    marginTop: 10
  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    marginRight: 10,
    width: "90%",
    height: 40
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: -1
  }
});
