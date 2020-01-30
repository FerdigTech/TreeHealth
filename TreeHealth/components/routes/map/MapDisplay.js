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
import Moment from "moment";
import RBush from "rbush";

export const MapDisplay = props => {
  const [showSearch, setShowSearch] = useState(false);
  const [Points, setPoints] = useState([]);
  const [currentProject] = useState(
    props.navigation.getParam("projectName", "All")
  );
  const [location, setLocation] = useState(null);
  const [errorMessage, setError] = useState(null);
  let mapRef = null;
  const tree = new RBush();

  // from the filter
  const DropDownVisible = props.navigation.getParam("DropDownVisible", false);
  const Operator = props.navigation.getParam("Operator", "none");
  const FilterAffilation = props.navigation.getParam("FilterAffilation", false);
  const OnlyAffilation = props.navigation.getParam("OnlyAffilation", false);
  const EndDateFilter = props.navigation.getParam("EndDateFilter", "");
  const dateFilter = props.navigation.getParam("dateFilter", "");
  const VisibleMarkers = props.navigation.getParam("VisibleMarkers", "");

  _onRegionChangeComplete = region => {
    let { width, height } = Dimensions.get("window");
    const ASPECT_RATIO = width / height;
    // Get points that are inside the region.
    visibleItems = tree.search({
      // Provide the coordinates of the south-west, north-east corners of the region.
      minX: region.longitude - region.longitudeDelta * ASPECT_RATIO,
      minY: region.latitude - region.latitudeDelta * ASPECT_RATIO,
      maxX: region.longitude + region.longitudeDelta * ASPECT_RATIO,
      maxY: region.latitude + region.latitudeDelta * ASPECT_RATIO
    });
    props.navigation.setParams({
      VisibleMarkers: visibleItems
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setError("Permission to access location was denied");
    } else {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      }).then(location => {
        setLocation(location);
      });
    }
  };

  const searchAndFocus = text => {
    const filteredPts = Points.filter(point =>
      point.title.toLowerCase().includes(text.toLowerCase())
    );

    // if there is a result of point's title containing the text
    if (filteredPts.length > 0) {
      // get the last item
      const lastPoint = filteredPts.pop();
      // extract them in proper form
      const coordinate = {
        longitude: lastPoint.longitude,
        latitude: lastPoint.latitude
      };

      mapRef.fitToCoordinates([coordinate], { animated: true });
    }
  };

  useEffect(() => {
    _getLocationAsync();
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
            onRegionChangeComplete={_onRegionChangeComplete}
          >
            <ProjectCosumer>
              {context => {
                setPoints(context.Points);
                tree.load(
                  context.Points.map(point => {
                    return {
                      minY: point.latitude,
                      minX: point.longitude,
                      maxY: point.latitude,
                      maxX: point.longitude
                    };
                  })
                );
              }}
            </ProjectCosumer>
            {Points.filter(
              point =>
                !FilterAffilation || !point.hasOwnProperty("affiliationid")
            )
              .filter(
                point =>
                  !OnlyAffilation || point.hasOwnProperty("affiliationid")
              )
              .filter(
                point =>
                  Operator != "before" ||
                  Moment(Moment.unix(point.createddate)).isSameOrBefore(
                    Moment(dateFilter)
                  )
              )
              .filter(
                point =>
                  Operator != "after" ||
                  Moment(Moment.unix(point.createddate)).isSameOrAfter(
                    Moment(dateFilter)
                  )
              )
              .filter(
                point =>
                  Operator != "dayof" ||
                  Moment(Moment.unix(point.createddate)).isSame(
                    Moment(dateFilter),
                    "day"
                  )
              )
              .filter(
                point =>
                  Operator != "range" ||
                  (Moment(Moment.unix(point.createddate)).isSameOrAfter(
                    Moment(dateFilter)
                  ) &&
                    Moment(Moment.unix(point.createddate)).isSameOrBefore(
                      Moment(EndDateFilter)
                    ))
              )
              .map((point, index) => {
                return (
                  <Marker
                    coordinate={{
                      longitude: point.longitude,
                      latitude: point.latitude
                    }}
                    title={
                      Moment.unix(point.createddate).format("LL") +
                      " - " +
                      point.county
                    }
                    // seems like when rerendering, react uses the key to update
                    // which can cause some colors to appear wrong, this can be fixed by passing a customID for each location
                    // see more at https://github.com/react-native-community/react-native-maps/issues/1611#issuecomment-334619684
                    key={Number.parseInt(
                      index.toString() + Date.now().toString()
                    )}
                    pinColor={
                      point.hasOwnProperty("affiliationid") ? "blue" : "red"
                    }
                    // this pends if the user can edit the point
                    draggable={true}
                    // TODO: once a user drags a point, it should bring them to the edit screen
                    onDragEnd={() => {}}
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
            NavigationService.navigate("RecordList", {
              projectName: currentProject,
              Operator,
              FilterAffilation,
              OnlyAffilation,
              EndDateFilter,
              dateFilter,
              VisibleMarkers
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
