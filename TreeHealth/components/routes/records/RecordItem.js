import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, ListItem, Text, Icon, Left, Body, Right } from "native-base";
import { ProjectContext } from "../../../context/ProjectProvider";
import { SwipeRow } from "react-native-swipe-list-view";
import NavigationService from "../../../services/NavigationService";
import Moment from "moment";

export const RecordItem = props => {
  const context = useContext(ProjectContext);
  const editRecord = locationid => {
    NavigationService.navigate("AddPoint", {
      locationid
    });
  };
  const isPending = props.pointData.approvalstatus !== "Approved";
  return (
    <SwipeRow
      key={props.indexVal}
      style={styles.standalone}
      disableRightSwipe={true}
      // only allow those who created to edit
      disableLeftSwipe={context.UserID != props.pointData.createdby }
      rightOpenValue={-75}
    >
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.standaloneRowBack}
          onPress={() => {
            editRecord(props.pointData.locationid);
          }}
          activeOpacity={0.5}
        >
          <Text style={styles.backTextWhite}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.standaloneRowFront}>
        <ListItem style={styles.listItemStyle}>
          <Body style={styles.leftHandInfo}>
            <Text style={styles.itemDate}>
              { (props.pointData.title ? props.pointData.title : "no title") + " - " + props.pointData.county}
            </Text>
            <Text style={styles.itemDraft}>
              {isPending ? "Pending approval" : " "}
            </Text>
            <Text style={styles.itemUpdated} note>
              last updated{" "}
              {Moment(props.pointData.createddate).format("LL")}
            </Text>
          </Body>
          <Right>
            <Button
              style={styles.lstIconBtn}
              warning={isPending}
              success={!isPending}
            >
              <Icon
                style={styles.listIcon}
                name={isPending ? "create" : "checkmark"}
              />
            </Button>
          </Right>
        </ListItem>
      </View>
    </SwipeRow>
  );
};

RecordItem.propTypes = {
  indexVal: PropTypes.number.isRequired,
  pointData: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  lstIconBtn: {
    alignSelf: "flex-end",
    height: 24,
    width: 24,
    borderRadius: 24,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: "center"
  },
  listIcon: {
    marginLeft: 0,
    marginRight: 0,
    fontSize: 18
  },
  itemUpdated: {
    alignSelf: "flex-start"
  },
  itemDraft: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "red"
  },
  itemDate: {
    fontWeight: "bold",
    alignSelf: "flex-start"
  },
  listItemStyle: {},
  leftHandInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignContent: "flex-start",
    textAlign: "left"
  },
  standalone: {
    flex: 1
  },
  standaloneRowFront: {
    backgroundColor: "#f4f4f4",
    zIndex: 2
  },
  standaloneRowBack: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
    padding: 20,
    backgroundColor: "#f0ad4e",
    zIndex: 2
  },
  backTextWhite: {
    color: "#FFF"
  }
});
