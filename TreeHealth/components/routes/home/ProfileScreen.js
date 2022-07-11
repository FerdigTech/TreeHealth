import React, { useState, useEffect, useContext } from "react";

import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  Alert
} from "react-native";
import {
  Card,
  CardItem,
  Body,
  Button,
  Toast
} from "native-base";
import Constants from "expo-constants";
import _ from "underscore";
import { deleteUser} from "./../../../services/FetchService";
import NavigationService from "../../../services/NavigationService";
import * as SecureStore from "expo-secure-store";


export const ProfileScreen = () => {
  

const handleDeletion = async () => {
    const userAuthData = await SecureStore.getItemAsync("userAuth");
    console.log("userAuthData-----------------",userAuthData);
    deleteUser(userAuthData);
    // NavigationService.navigate('SignInScreen');
}

  const handleAlert = () => {
   
    Alert.alert(
        "Warning",
        "Are you sure you want to delete your account?",
        [
          {
              text:"No",
            cancelable: true,
            
          },
          { text: "Yes", 
          onPress: () => handleDeletion() }
        ]
      );    
   
  };


  return (
    <SafeAreaView style={styles.SafeView}>
      <ScrollView>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>Profile</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>
                  Welcome to your Profile
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
              onPress={() => {
                handleAlert();
              }}
              style={styles.CacheBtn}
            >
              <Text style={styles.CacheBtnTxt}>Click here to delete your account!</Text>
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
