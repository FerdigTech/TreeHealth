import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import { Form, Item, Input, Button } from "native-base";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { useNetInfo } from "@react-native-community/netinfo";

export const AddPoint = () => {
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

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setError("Permission to access location was denied");
    }
  };

  return (
    <SafeAreaView style={styles.AddPtView}>
      <ScrollView>
        <Text>Type: {netInfo.type}</Text>
        <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
        <Form>
          <Item style={styles.formItem} rounded>
            <Input
              value={
                location != null ? location.coords.latitude.toString() : ""
              }
              placeholder="Latitude"
              onChangeText={e => {}}
            />
          </Item>
          <Item style={styles.formItem} rounded>
            <Input
              value={
                location != null ? location.coords.longitude.toString() : ""
              }
              placeholder="Longitude"
              onChangeText={e => {}}
            />
          </Item>
        </Form>
        <Button
          style={styles.recordBtn}
          primary
          rounded
          block
          onPress={() => {}}
        >
          <Text style={styles.RecordBtnTxt}> Add Record</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AddPtView: {
    margin: 10
  },
  formItem: {
    margin: 15,
    padding: 5
  },
  recordBtn: {
    marginTop: 10
  },
  RecordBtnTxt: {
    color: "white"
  }
});
