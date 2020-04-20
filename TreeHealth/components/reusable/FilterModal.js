import React, { useEffect, useRef, useCallback, useState } from "react";
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Platform } from "react-native";
import {
  DatePicker,
  List,
  ListItem,
  Icon,
  Picker,
  Item,
  Right,
  Left,
  Button,
  CheckBox
} from "native-base";
import Modal from "react-native-modal";
import Moment from "moment";

export const FilterModal = props => {
  // reset the settings
  cleanUP = () => {
    props.navigation.setParams({
      DropDownVisible: false
    });
  };

  useEffect(() => {
    cleanUP();
    return () => {
      cleanUP();
    };
  }, []);

  setDateFilter = date => {
    props.navigation.setParams({
      dateFilter: date
    });
  };

  setEndDateFilter = date => {
    props.navigation.setParams({
      EndDateFilter: date
    });
  };

  setOperator = Operator => {
    props.navigation.setParams({
      Operator: Operator
    });
  };

  ToggleFilterAffilation = () => {
    props.navigation.setParams({
      FilterAffilation: !FilterAffilation
    });
  };

  ToggleOnlyAffilation = () => {
    props.navigation.setParams({
      OnlyAffilation: !OnlyAffilation
    });
  };

  toggleDropVis = () => {
    const DropDownVisible = props.navigation.getParam("DropDownVisible");

    props.navigation.setParams({
      DropDownVisible: !DropDownVisible
    });
  };
  // defaults to keeping the modal closed
  const DropDownVisible = props.navigation.getParam("DropDownVisible", false);
  const Operator = props.navigation.getParam("Operator", "none");
  const FilterAffilation = props.navigation.getParam("FilterAffilation", false);
  const OnlyAffilation = props.navigation.getParam("OnlyAffilation", false);
  const EndDateFilter = props.navigation.getParam("EndDateFilter", "");
  const dateFilter = props.navigation.getParam("dateFilter", "");

  const DatePickerRef = useCallback(
    datepicker => {
      if (datepicker != null) {
        if (datepicker.props.dateFilter != null) {
          datepicker.state.chosenDate = datepicker.props.dateFilter;
          datepicker.props.onDateChange(datepicker.state.chosenDate);
        }
      }
    },
    [dateFilter]
  );

  const EndDatePickerRef = useCallback(
    datepicker => {
      if (datepicker != null) {
        if (datepicker.props.EndDateFilter != null) {
          datepicker.state.chosenDate = datepicker.props.EndDateFilter;
          datepicker.props.onDateChange(datepicker.state.chosenDate);
        }
      }
    },
    [EndDateFilter]
  );
  return (
    <View style={{ flex: 1 }}>
      <Modal
        onSwipeThreshold={750}
        onSwipeComplete={() => this.toggleDropVis()}
        onBackButtonPress={() =>
          props.navigation.setParams({
            DropDownVisible: false
          })
        }
        swipeDirection="down"
        isVisible={DropDownVisible}
        scrollHorizontal={true}
        style={{ margin: 0 }}
      >
        <SafeAreaView>
          <ScrollView style={styles.dropLst}>
            <Button danger block onPress={() => this.toggleDropVis()}>
              <Text style={{ color: "white" }}>Close</Text>
            </Button>
            <List>
              {Platform.OS !== 'ios' && (
              <React.Fragment>
              <ListItem itemDivider>
                <Text style={styles.divingTxt}>Filter By Date:</Text>
              </ListItem>
              <ListItem>
                <Text>
                  {Operator == "range" ? "Start Date: " : "Date Selected: "}
                </Text>
                <DatePicker
                  dateFilter={dateFilter}
                  ref={DatePickerRef}
                  locale={"en"}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Select a date"
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={setDateFilter}
                  // to make sure they can't select a day past the endDate
                  maximumDate={
                    Operator == "range"
                      ? EndDateFilter != "" && EndDateFilter != null
                        ? EndDateFilter
                        : new Date()
                      : new Date()
                  }
                  formatChosenDate={date => {
                    return Moment(date).format("ll");
                  }}
                />
              </ListItem>
              {Operator == "range" && (
                <ListItem>
                  <Text>End Date: </Text>
                  <DatePicker
                    EndDateFilter={EndDateFilter}
                    ref={EndDatePickerRef}
                    locale={"en"}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select a date"
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onDateChange={setEndDateFilter}
                    minimumDate={
                      dateFilter != "" && dateFilter != null
                        ? dateFilter
                        : new Date()
                    }
                    // to make sure they can't select a date before startDate
                    disabled={dateFilter == "" || dateFilter == null}
                    maximumDate={new Date()}
                    formatChosenDate={date => {
                      return Moment(date).format("ll");
                    }}
                  />
                </ListItem>
              )}
              <ListItem>
                <Text>Date Operator: </Text>
                <Item picker>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined }}
                    placeholder="Select your Operator"
                    placeholderStyle={{ color: "#d3d3d3" }}
                    placeholderIconColor="#000"
                    selectedValue={Operator}
                    onValueChange={value => setOperator(value)}
                  >
                    <Picker.Item label="None" value="none" />
                    <Picker.Item label="Before" value="before" />
                    <Picker.Item label="After" value="after" />
                    <Picker.Item label="Range" value="range" />
                    <Picker.Item label="The day of" value="dayof" />
                  </Picker>
                </Item>
              </ListItem>
              </React.Fragment>)}
              <ListItem itemDivider>
                <Text style={styles.divingTxt}>Filter By Affilation:</Text>
              </ListItem>
              <ListItem>
                <Text>Remove Affilation</Text>
                <CheckBox
                  onPress={() => ToggleFilterAffilation()}
                  checked={FilterAffilation}
                  color="black"
                  style={styles.checkBoxes}
                />
              </ListItem>
              <ListItem>
                <Text>Only Show Affilation</Text>
                <CheckBox
                  onPress={() => ToggleOnlyAffilation()}
                  checked={OnlyAffilation}
                  color="black"
                  style={styles.checkBoxes}
                />
              </ListItem>
              <ListItem>
                <Left />
                <Right>
                  <Button
                    block
                    primary
                    onPress={() => {
                      setOperator(null);
                      setDateFilter("");
                      setEndDateFilter("");
                      //if (EndDatePickerRef.current != null) {
                      //  EndDatePickerRef.current.state.chosenDate = null;
                      // }
                      //DatePickerRef.current.state.chosenDate = null;
                      props.navigation.setParams({
                        OnlyAffilation: false
                      });
                      props.navigation.setParams({
                        FilterAffilation: false
                      });
                    }}
                    title={"Reset"}
                  >
                    <Text style={{ color: "white" }}>Reset</Text>
                  </Button>
                </Right>
              </ListItem>
            </List>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropLst: {
    backgroundColor: "white",
    alignContent: "center",
    height: "100%"
  },
  checkBoxes: {
    marginLeft: 5
  },
  divingTxt: {
    fontWeight: "bold"
  }
});
