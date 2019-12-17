import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Button, AsyncStorage } from "react-native";
import { HomeList } from "./HomeList";
import { LogoTitle } from "./../../reusable/LogoTitle";

export class HomeScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />,
    headerRight: null
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
            menuAction={() => navigate("ProjectOverview")}
            iconName="map"
            menuName="Projects"
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

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  listLayout: {
    justifyContent: "space-around",
    flex: 1
  }
});
