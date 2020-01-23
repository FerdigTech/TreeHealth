import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { Form, Item, Input, Button, Label, Toast } from "native-base";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { useNetInfo } from "@react-native-community/netinfo";
import NavigationService from "../../../services/NavigationService";
import { ProjectContext } from "../../../context/ProjectProvider";

export const AddPoint = props => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setError] = useState(null);
  const netInfo = useNetInfo();
  const context = useContext(ProjectContext);

  const locationID = props.navigation.getParam("locationid", null);

  const FilteredPoints = context.Points.filter(
    point => point.locationid == locationID
  );

  const { longitude, latitude } =
    FilteredPoints.length >= 1 ? FilteredPoints[0] : {};

  useEffect(() => {
    if (locationID == null) {
      _getLocationAsync();
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      }).then(location => {
        setLocation(location);
      });
    } else {
      setLocation({
        coords: {
          longitude: longitude,
          latitude: latitude
        }
      });
    }
  }, []);

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setError("Permission to access location was denied");
    }
  };

  _updateLatitude = ({ text }) => {
    let newState = Object.assign({}, location);
    const input = text.toString();
    if (input) {
      newState.coords.latitude = input;
    } else {
      newState.coords.latitude = "";
    }
    setLocation(newState);
  };

  _updateLongitude = ({ text }) => {
    let newState = Object.assign({}, location);
    const input = text.toString();
    if (input) {
      newState.coords.longitude = input;
    } else {
      newState.coords.longitude = "";
    }
    setLocation(newState);
  };

  _handleSubmit = () => {
    // this isn't a guest user
    if (context.UserID != null) {
      // if we are editing..
      if (locationID != null) {
        // Then the current coordinates do not match that off the old coordinates
        // we need to update that information
        if (
          longitude != location.coords.longitude ||
          latitude != location.coords.latitude
        ) {
          // TODO: push this information to the server
        }
      }
      // if we are editting, send over a locationID otherwise send over the location
      NavigationService.navigate(
        "PointQuestions",
        locationID == null
          ? {
              location: location
            }
          : { locationid: locationID }
      );
    } else {
      Toast.show({
        text:
          "“Warning! Your data will not be submitted unless you register. This is only to test the app”",
        buttonText: "Okay",
        type: "warning",
        position: "top",
        duration: 3000
      });
    }
  };

  return (
    <SafeAreaView style={styles.AddPtView}>
      <ScrollView>
        {location == null &&
          netInfo.isConnected &&
          locationID == null && (
            <View style={styles.loadingView}>
              <Text style={styles.loadingInstrHeader}>Processing Location</Text>
              <ActivityIndicator />
              <Text style={styles.loadingInstr}>
                If this takes longer than expected, please make sure location is
                enabled and retry again.
              </Text>
              <Text style={styles.loadingInstr}>
                This is the result of not giving the App permissions.
              </Text>
            </View>
          )}
        {!netInfo.isConnected &&
          locationID == null && (
            <View style={styles.offlineView}>
              <Text style={styles.offlineHeadInstr}>Offline Mode</Text>
              <Text style={styles.offlineInstr}>
                The data will be queued to be uploaded when your device appears
                to have service.
              </Text>
            </View>
          )}

        {locationID != null && (
          <View style={styles.offlineView}>
            <Text style={styles.offlineHeadInstr}>Edit Mode</Text>
            <Text style={styles.offlineInstr}>
              Warnning, you are editing already existing data. Saving will
              result in overwritting.
            </Text>
          </View>
        )}
        <Form style={styles.form}>
          <Item style={styles.formItem} rounded floatingLabel>
            <Label style={styles.itemStyle}>Latitude</Label>
            <Input
              keyboardType={"decimal-pad"}
              style={styles.itemStyle}
              value={
                location != null ? location.coords.latitude.toString() : " "
              }
              placeholder="Latitude"
              onChangeText={text => _updateLatitude({ text })}
            />
          </Item>
          <Item style={styles.formItem} rounded floatingLabel>
            <Label style={styles.itemStyle}>Longitude</Label>
            <Input
              keyboardType={"decimal-pad"}
              style={styles.itemStyle}
              value={
                location != null ? location.coords.longitude.toString() : " "
              }
              placeholder="Longitude"
              onChangeText={text => _updateLongitude({ text })}
            />
          </Item>
        </Form>
        <Button
          style={styles.recordBtn}
          primary
          rounded
          block
          onPress={() => {
            _handleSubmit();
          }}
        >
          <Text style={styles.RecordBtnTxt}> Add Record</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AddPtView: {},
  formItem: {
    margin: 15,
    padding: 5
  },
  form: {
    margin: 10
  },
  itemStyle: {
    padding: 10
  },
  recordBtn: {
    margin: 10
  },
  RecordBtnTxt: {
    color: "white"
  },
  loadingView: {
    flex: 1,
    justifyContent: "center"
  },
  loadingInstr: {
    fontSize: 18
  },
  loadingInstrHeader: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    padding: 10
  },
  offlineHeadInstr: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    color: "white"
  },
  offlineInstr: {
    fontSize: 18,
    color: "white"
  },
  offlineView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "red",
    width: "100%",
    padding: 10
  }
});
