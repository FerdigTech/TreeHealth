import React from "react";

import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  AsyncStorage,
  Text
} from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Button,
  Toast
} from "native-base";
import Constants from "expo-constants";

export const AboutUsScreen = () => {
  const handleClearCache = async () => {
    await AsyncStorage.clear();
    Toast.show({
      text:
        "Your cache has been cleared, it may take a restart of the app to work.",
      buttonText: "Okay",
      type: "success",
      position: "top",
      duration: 3000
    });
  };
  return (
    <SafeAreaView style={styles.SafeView}>
      <ScrollView>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>About us</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>
                  Tree Health Survey (THS) is a smartphone app developed for field data collection efforts that 
                  track impacts to forest health caused by non-native pests and pathogens. THS hosts a beech
                  leaf disease project that allows users to contribute data and track the occurrence of this
                  emerging forest health crisis. Users will join a collaborative community of citizen scientists,
                  natural resource managers, foresters, and more from across the country to provide a large-
                  scale account of this and other emerging forest pests. Each project will have its own training
                  section, allowing users to learn background information and identification skills they will need
                  before participating in data collection.{"\n\n"}
                  Thank you for your contribution.
                  </Text>
                </Body>
              </View>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>Feedback</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>
                  Are you experiencing an issue with the app? Do you have a suggestion for a citizen science 
                  project? Reach out to us at treehealthapp@gmail.com 
                  </Text>
                </Body>
              </View>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>Funding for this project</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>
                  Tree Health Survey was provided funding by the USDA Forest Service to expand the capabilities 
                  of the beech leaf disease project. This app was originally created as a spinoff from ParkApps NE 
                  Ohio, a project between Kent State University, Cuyahoga Valley National Park, and Cleveland 
                  Metroparks (funding for ParkApps NE Ohio provided by National Science Foundation #1422764).
                  </Text>
                </Body>
              </View>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>App Version</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>{Constants.manifest.version}</Text>
                </Body>
              </View>
            </Card>
            <Button
              block
              danger
              onPress={() => handleClearCache()}
              style={styles.CacheBtn}
            >
              <Text style={styles.CacheBtnTxt}>Clear Cache</Text>
            </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeView: {
    backgroundColor: "#fff",
    margin: 10
  },
  HeaderTxt: {
    fontWeight: "bold"
  },
  CardBody: {
    padding: 10
  },
  CacheBtnTxt: {
    color: "white"
  },
  CacheBtn: {
    marginTop: 5
  }
});
