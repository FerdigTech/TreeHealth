import React from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";

export const IntroScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.DefaultView}>
        <Text>Filler</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  DefaultView: {
    flex: 1,
    backgroundColor: "white"
  }
});
