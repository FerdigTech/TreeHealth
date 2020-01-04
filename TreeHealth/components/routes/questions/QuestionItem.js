import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, ListItem, Text, Icon, Left, Body, Right } from "native-base";
import { SwipeRow } from "react-native-swipe-list-view";

export const QuestionItem = props => {
  return (
    <SwipeRow key={props.indexVal}
      style={styles.standalone}
      disableRightSwipe={true}
      rightOpenValue={-75}
    >
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.standaloneRowBack}
          onPress={() => {}}
          activeOpacity={0.5}
        >
          <Text style={styles.backTextWhite}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.standaloneRowFront}>
        <ListItem style={styles.listItemStyle}>
          <Left style={styles.leftHandInfo}>
            <Text style={styles.itemDate}>October 14, 2019</Text>
            <Text style={styles.itemDraft}>
              {props.isDraft ? "Draft" : " "}
            </Text>
            <Text style={styles.itemUpdated} note>
              last updated August 3, 2019
            </Text>
          </Left>
          <Body />
          <Right>
            <Button
              style={styles.lstIconBtn}
              warning={props.isDraft}
              success={!props.isDraft}
            >
              <Icon
                style={styles.listIcon}
                name={props.isDraft ? "create" : "checkmark"}
              />
            </Button>
          </Right>
        </ListItem>
      </View>
    </SwipeRow>
  );
};

QuestionItem.propTypes = {
  isDraft: PropTypes.bool.isRequired,
  indexVal: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  lstIconBtn: {
    alignSelf: "flex-end",
    height: 24,
    width: 24,
    borderRadius: 24,
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
    alignSelf: "flex-start"
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
