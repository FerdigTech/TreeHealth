import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Text, Form, Item, Input, Label } from "native-base";
import { LogoTitle } from "../../reusable/LogoTitle";
import { handlePassReset } from "./../../../services/FetchService";

export const ForgotPwScreen = props => {
  const [Email, setEmail] = useState("");

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
        onPress={() => handlePassReset(Email)}
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
