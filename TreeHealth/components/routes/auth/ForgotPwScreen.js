import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Text, Form, Item, Input, Label, Toast } from "native-base";
import { LogoTitle } from "../../reusable/LogoTitle";
import globals from "../../../globals";

export const ForgotPwScreen = props => {
  const [Email, setEmail] = useState("");

  const handlePassReset = async () => {
    await fetch(globals.SERVER_URL + "/userAccount/resetPassword", {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: Email
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          Toast.show({
            text: "A password reset has been to the associated email.",
            buttonText: "Okay",
            type: "success",
            position: "top",
            duration: 3000
          });
        }
      })
      .catch(err => {});
  };
  const PassedEmail = props.navigation.getParam("email", "");

  useEffect(() => {
    // set the email if it was passed
    setEmail(PassedEmail);
  }, []);

  return (
    <SafeAreaView style={styles.SafeView}>
      <Form>
        <Item floatingLabel>
          <Label>Email</Label>
          <Input
            autoCompleteType={"email"}
            keyboardType={"email-address"}
            onChangeText={text => setEmail(text)}
            value={Email == "" ? null : Email}
          />
        </Item>
      </Form>
      <Button
        style={styles.ResetBtn}
        rounded
        block
        onPress={() => handlePassReset()}
        disabled={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email)}
      >
        <Text> Reset Password </Text>
      </Button>
    </SafeAreaView>
  );
};

ForgotPwScreen.navigationOptions = {
  // Use logo instead of text
  headerTitle: () => <LogoTitle />
};

const styles = StyleSheet.create({
  SafeView: {
    flex: 1,
    margin: 50
  },
  ResetBtn: {
    marginTop: 50
  }
});
