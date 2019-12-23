import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Button, AsyncStorage } from "react-native";
import { HomeList } from "./HomeList";
import { LogoTitle } from "./../../reusable/LogoTitle";
import NavigationService from "../../../NavigationService";

export class HomeScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />,
    headerRight: null
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Logout" onPress={this._signOutAsync} />
        <View style={styles.listLayout}>
          <HomeList
            menuAction={() => NavigationService.navigate("Map")}
            iconName="people"
            menuName="About Us"
          />
          <HomeList
            menuAction={() => NavigationService.navigate("Map")}
            iconName="hand"
            menuName="Introduction"
          />
          <HomeList
            menuAction={() => NavigationService.navigate("ProjectOverview")}
            iconName="map"
            menuName="Projects"
          />
        </View>
      </View>
    );
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    NavigationService.navigate("Auth");
  };
}


const styles = StyleSheet.create({
  listLayout: {
    justifyContent: "space-around",
    flex: 1
  }
});
