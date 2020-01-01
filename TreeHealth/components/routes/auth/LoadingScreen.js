import React from "react";
import {
  View,
  StatusBar,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet
} from "react-native";
import NavigationService from "../../../services/NavigationService";


export class LoadingScreen extends React.Component {
  // used constructor as props navigation props are needed
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    // if token exist goes to Homepage, otherwise login
    NavigationService.navigate(userToken ? "Home" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: "center"
  }
});
