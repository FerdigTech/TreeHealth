import React from "react";
import PropTypes from "prop-types";
import { Marker, Callout } from "react-native-maps";
import MapView from "react-native-maps";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
  StatusBar,
  TextInput
} from "react-native";
import { Container, Content } from "native-base";
import { MarkerModal } from "./MarkerModal";
import { FooterTabs } from "../../reusable/FooterTabs";
import {TitleDrop} from "../../reusable/TitleDrop";

export class MapDisplay extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => (
      <TitleDrop projectName={navigation.getParam("projectName", "All")} />
    )
  });
  // initalize the default values in state
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      mapPts: {},
      showSearch: false,
      currentProject: this.props.navigation.getParam("projectName", "All")
    };
  }

  // this is for the fetch await and async component mount
  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  // Get all the map points from the site
  async componentDidMount() {
    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(true);
    }

    const points = await fetch("https://127.0.0.1:8000/Indexpoints.geojson")
      .then(response => response.json())
      .catch(function(error) {
        console.log(error.message);
        throw error;
      });

    if (Platform.OS === "ios") {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    await this.setStateAsync({ mapPts: points });
  }

  toggleModalVis() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }
  toggleSearchVis() {
    this.setState({ showSearch: !this.state.showSearch });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          <Content>
            <StatusBar
              style={styles.statusBar}
              backgroundColor="blue"
              barStyle="light-content"
            />
            <MapView style={styles.mapStyle} initialRegion={zoomNEOhio.region}>
              <Marker
                coordinate={{
                  longitude: -81.4899204,
                  latitude: 41.50191905
                }}
                title={"Acacia Clubhouse"}
                onPress={() => this.toggleModalVis()}
              />
              <Marker
                coordinate={{
                  longitude: -81.52245312,
                  latitude: 41.53738951
                }}
                title={"Euclid Creek Management Office"}
                onPress={() => this.toggleModalVis()}
              />
              <Marker
                coordinate={{
                  longitude: -81.52248681,
                  latitude: 41.53940433
                }}
                title={"Rear Quarry"}
                onPress={() => this.toggleModalVis()}
              />
            </MapView>
            <MarkerModal
              show={this.state.modalVisible}
              handleClose={() => this.toggleModalVis()}
            />
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
              navigate("ProjectStacked", {
                projectName: this.state.currentProject
              })
            }
            funnelToggle={() => {}}
            SearchToggle={() => this.toggleSearchVis()}
            addItemAction={() =>
              navigate("QuestionList", {
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
  region: {
    latitude: 41.215078,
    longitude: -81.562843,
    latitudeDelta: 3 / 4,
    longitudeDelta: 3 / 4
  }
};

MapDisplay.propTypes = {
  navigation: PropTypes.object.isRequired
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
  statusBar: {
    height: Platform.OS === "ios" ? 20 : 0,
    zIndex: 3
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
