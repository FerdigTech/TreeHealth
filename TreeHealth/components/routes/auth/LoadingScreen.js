import React, { useEffect, useContext } from "react";
import { View, StatusBar, ActivityIndicator, StyleSheet } from "react-native";
import NavigationService from "../../../services/NavigationService";
import { ProjectContext } from "../../../context/ProjectProvider";
import * as SecureStore from "expo-secure-store";

export const LoadingScreen = () => {
  const context = useContext(ProjectContext);
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await SecureStore.getItemAsync("userAuth");
    // if token exist goes to Homepage, otherwise login
    NavigationService.navigate(userToken != null ? "Home" : "Auth");
  };

  useEffect(() => {
    _bootstrapAsync();
  }, []);

  return (
    <View style={styles.loadingView}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: "center"
  }
});
