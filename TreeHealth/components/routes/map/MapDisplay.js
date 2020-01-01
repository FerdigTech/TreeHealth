import React, { useEffect, useState } from "react";
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
import { Container, Content, Text } from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop, ProjectsModalDrop } from "../../reusable/TitleDrop";
import NavigationService from "../../../services/NavigationService";
import { ProjectCosumer } from "../../../context/ProjectProvider";
import { useNetInfo } from "@react-native-community/netinfo";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

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
              key={index}
            />
          );
        })
      }
    </ProjectCosumer>
  );
}

_getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== "granted") {
    this.setState({
      errorMessage: "Permission to access location was denied"
    });
  }
};

export const MapDisplay = props => {
  const [showSearch, setShowSearch] = useState(false);
  const [currentProject] = useState(
    props.navigation.getParam("projectName", "All")
  );
  const [location, setLocation] = useState(null);
  const [errorMessage, setError] = useState(null);
  const netInfo = useNetInfo();

  useEffect(() => {
    _getLocationAsync();
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    }).then(location => {
      console.log("latitude " + location.coords.latitude);
      console.log("longitude " + location.coords.longitude);
      setLocation(location);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <Animated style={styles.mapStyle} initialRegion={zoomNEOhio.region}>
            <PointsEl />
          </Animated>
          <ProjectsModalDrop navigation={props.navigation} />
          {showSearch && (
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
            NavigationService.navigate("PointsStacked", {
              projectName: currentProject
            })
          }
          funnelToggle={() => {}}
          SearchToggle={() => {setShowSearch(!showSearch)}}
          addItemAction={() =>
            NavigationService.navigate("QuestionList", {
              projectName: currentProject
            })
          }
        />
      </Container>
    </SafeAreaView>
  );
};

MapDisplay.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <TitleDrop
      navigation={navigation}
      projectName={navigation.getParam("projectName", "All")}
    />
  )
});

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
