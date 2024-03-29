import React, { useContext } from "react";
import { View, StyleSheet, Button, AsyncStorage } from "react-native";
import { HomeList } from "./HomeList";
import { LogoTitle } from "../../reusable/LogoTitle";
import NavigationService from "../../../services/NavigationService";
import { ProjectContext } from "../../../context/ProjectProvider";

export const HomeScreen = () => {
  const context = useContext(ProjectContext);

  const _signOutAsync = async () => {
    context.processLogout();
    await AsyncStorage.clear();
    NavigationService.navigate("Auth");
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Logout" onPress={_signOutAsync} />
      <View style={styles.listLayout}>
        <HomeList
          menuAction={() => NavigationService.navigate("AboutUsScreen")}
          iconName="people"
          menuName="About Us"
        />
        <HomeList
          menuAction={() => NavigationService.navigate("IntroScreen")}
          iconName="ios-hand-left-sharp"
          menuName="Introduction"
        />
        <HomeList
          menuAction={() => NavigationService.navigate("ProjectOverview")}
          iconName="map"
          menuName="Projects"
        />
         <HomeList
          menuAction={() => NavigationService.navigate("ProfileScreen")}
          iconName="people"
          menuName="Profile"
        />
      </View>
    </View>
  );
};

HomeScreen.navigationOptions = {
  // Use logo instead of text
  headerTitle: () => <LogoTitle />,
  headerRight: ()=> null,
};

const styles = StyleSheet.create({
  listLayout: {
    justifyContent: "space-around",
    flex: 1
  }
});
