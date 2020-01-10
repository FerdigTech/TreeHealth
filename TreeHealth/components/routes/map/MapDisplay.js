import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  TextInput
} from "react-native";
import { Container, Content, Text } from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop } from "../../reusable/TitleDrop";
import { FilterModal } from "../../reusable/FilterModal";
import NavigationService from "../../../services/NavigationService";
import { ProjectCosumer } from "../../../context/ProjectProvider";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export const MapDisplay = props => {
  const [showSearch, setShowSearch] = useState(false);
  const [Points, setPoints] = useState([]);
  const [currentProject] = useState(
    props.navigation.getParam("projectName", "All")
  );
  const [location, setLocation] = useState(null);
  const [errorMessage, setError] = useState(null);
  let mapRef = null;

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setError("Permission to access location was denied");
    }
  };

  const searchAndFocus = text => {
    const filteredPts = Points.filter(point =>
      point.properties.title.toLowerCase().includes(text.toLowerCase())
    );

    // if there is a result of point's title containing the text
    if (filteredPts.length > 0) {
      // get the last item
      const { geometry } = filteredPts.pop();
      // get its coordinates
      const { coordinates } = geometry;
      // extract them in proper form
      const coordinate = {
        longitude: coordinates[0],
        latitude: coordinates[1]
      };

      mapRef.fitToCoordinates([coordinate], { animated: true });
    }
  };

  useEffect(() => {
    _getLocationAsync();
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    }).then(location => {
      setLocation(location);
    });
  }, []);

  toggleDropVis = () => {
    const DropDownVisible = props.navigation.getParam("DropDownVisible");

    props.navigation.setParams({
      DropDownVisible: !DropDownVisible
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Content>
          <MapView
            ref={ref => {
              mapRef = ref;
            }}
            style={styles.mapStyle}
            initialRegion={zoomNEOhio.region}
            showsUserLocation={true}
            showsTraffic={false}
            loadingEnabled={true}
            cacheEnabled={true}
          >
            <ProjectCosumer>
              {context => setPoints(context.Points)}
            </ProjectCosumer>
            {Points.map((point, index) => {
              return (
                <Marker
                  coordinate={{
                    longitude: point.geometry.coordinates[0],
                    latitude: point.geometry.coordinates[1]
                  }}
                  title={point.properties.title}
                  key={index}
                  pinColor={point.properties.AffiliationID > 0 ? "blue" : "red"}
                />
              );
            })}
          </MapView>
          <FilterModal navigation={props.navigation} />
          {showSearch && (
            <Callout>
              <View style={styles.calloutView}>
                <TextInput
                  style={styles.calloutSearch}
                  placeholder={"Search"}
                  onEndEditing={e => searchAndFocus(e.nativeEvent.text)}
                />
              </View>
            </Callout>
          )}
        </Content>
        <FooterTabs
          listIcon="list"
          switchView={() =>
            NavigationService.navigate("QuestionList", {
              projectName: currentProject
            })
          }
          funnelToggle={() => toggleDropVis()}
          SearchToggle={() => {
            setShowSearch(!showSearch);
          }}
          addItemAction={() =>
            NavigationService.navigate("AddPoint", {
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
  region: {
    latitude: 41.215078,
    longitude: -81.562843,
    latitudeDelta: 3 / 4,
    longitudeDelta: 3 / 4
  }
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
