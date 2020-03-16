import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from "react-native";
import { RecordItem } from "./RecordItem";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Fab
} from "native-base";
import { FilterModal } from "../../reusable/FilterModal";
import { ProjectContext } from "../../../context/ProjectProvider";
import Moment from "moment";
import RBush from "rbush";

export const RecordList = props => {
  const [Points, setPoints] = useState([]);
  const context = useContext(ProjectContext);
  // from the filter
  const DropDownVisible = props.navigation.getParam("DropDownVisible", false);
  const Operator = props.navigation.getParam("Operator", "none");
  const FilterAffilation = props.navigation.getParam("FilterAffilation", false);
  const OnlyAffilation = props.navigation.getParam("OnlyAffilation", false);
  const EndDateFilter = props.navigation.getParam("EndDateFilter", "");
  const dateFilter = props.navigation.getParam("dateFilter", "");
  const VisibleMarkers = props.navigation.getParam("VisibleMarkers", []);
  const tree = new RBush();

  toggleDropVis = () => {
    props.navigation.setParams({
      DropDownVisible: true
    });
  };

  useEffect(() => {
    setPoints(context.Points);
  }, []);
  return (
    <Container>
      <Content>
        <ScrollView style={{ flex: 1 }}>
          {VisibleMarkers.length != Points.length && (
            <View style={styles.ZoomWarning}>
              <Text style={styles.ZoomWarnTxt}>
                A zoom filter has been applied
              </Text>
              <Text style={styles.ZoomWarnTxt}>
                This will remove records that you're unable to see on the map
              </Text>
            </View>
          )}
          {Points.filter(
              point =>
                !FilterAffilation || !point.affiliationid
            )
              .filter(
                point =>
                  !OnlyAffilation || point.affiliationid
              )
              .filter(
                point =>
                  Operator != "before" ||
                  Moment(point.createddate).isSameOrBefore(
                    Moment(dateFilter)
                  )
              )
              .filter(
                point =>
                  Operator != "after" ||
                  Moment(point.createddate).isSameOrAfter(
                    Moment(dateFilter)
                  )
              )
              .filter(
                point =>
                  Operator != "dayof" ||
                  Moment(point.createddate).isSame(
                    Moment(dateFilter),
                    "day"
                  )
              )
              .filter(
                point =>
                  Operator != "range" ||
                  (Moment(point.createddate).isSameOrAfter(
                    Moment(dateFilter)
                  ) &&
                    Moment(point.createddate).isSameOrBefore(
                      Moment(EndDateFilter)
                    ))
              )
            .filter(point => {
              tree.load(VisibleMarkers);
              return tree.collides({
                minY: point.latitude,
                minX: point.longitude,
                maxY: point.latitude,
                maxX: point.longitude
              });
            })
            .map((point, index) => {
              return (
                <RecordItem
                  key={index}
                  indexVal={index}
                  pointData={point}
                  isDraft={false}
                />
              );
            })}
        </ScrollView>
        <FilterModal navigation={props.navigation} />
      </Content>
      <Fab
        active={false}
        direction="up"
        style={styles.filterIcon}
        position="bottomRight"
        onPress={() => toggleDropVis()}
      >
        <Icon type="Feather" name="filter" />
      </Fab>
      {context.OfflineQueue.length > 0 && (
        <Footer>
          <FooterTab style={styles.footerStyle}>
            <Text style={styles.footerTxt}>
              You have {context.OfflineQueue.length.toString()} item{context
                .OfflineQueue.length > 1
                ? "s"
                : ""}{" "}
              in offline queue.
            </Text>
          </FooterTab>
        </Footer>
      )}
    </Container>
  );
};

RecordList.navigationOptions = ({ navigation, navigationOptions }) => ({
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate("AddPoint")}>
      <Text style={styles.NavText}>Add Record</Text>
    </TouchableOpacity>
  ),
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Map", navigation.state.params);
      }}
    >
      <Icon
        name="arrow-back"
        style={{
          color: navigationOptions.headerTintColor,
          paddingLeft: 20,
          fontSize: 24
        }}
      />
    </TouchableOpacity>
  )
});

const styles = StyleSheet.create({
  NavText: {
    color: "white",
    paddingRight: 10
  },
  footerTxt: {
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
    flex: 1
  },
  footerStyle: {
    backgroundColor: "#f4f4f4",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    zIndex: 2
  },
  filterIcon: {
    backgroundColor: "#d9534f",
    zIndex: 5
  },
  ZoomWarning: {
    backgroundColor: "#f0ad4e",
    borderBottomColor: "#c7c7c7",
    borderBottomWidth: 1
  },
  ZoomWarnTxt: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 5
  }
});
