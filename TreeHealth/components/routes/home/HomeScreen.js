import React from "react";
import { View, StyleSheet, Button, AsyncStorage } from "react-native";
import { HomeList } from "./HomeList";
import { LogoTitle } from "./../../reusable/LogoTitle";

export class HomeScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <Button title="Logout" onPress={this._signOutAsync} />
        <View style={styles.listLayout}>
          <HomeList
            menuAction={() => navigate("Map")}
            iconName="people"
            menuName="About Us"
          />
          <HomeList
            menuAction={() => navigate("Map")}
            iconName="hand"
            menuName="Introduction"
          />
          <HomeList
            menuAction={() => navigate("Map")}
            iconName="map"
            menuName="Projects"
          />
          <HomeList
            menuAction={() => navigate("Map")}
            iconName="help-circle"
            menuName="Project Questions"
          />
        </View>
      </View>
    );
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };
}

const styles = StyleSheet.create({
  listLayout: {
    justifyContent: "space-around",
    flex: 1
  }
});
