import React from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Form, Item, Input, Label, Container } from "native-base";
import { LogoTitle } from "../../reusable/LogoTitle";

export class RegisterScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />
  };

  render() {
    return (
      <SafeAreaView style={styles.signUpView}>
        <ScrollView>
          <Form style={styles.signUpForm}>
          <Item floatingLabel>
              <Label>Name</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry={true} />
            </Item>
            <Item floatingLabel>
              <Label>Affiliation</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Age</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Request Data Access?</Label>
              <Input />
            </Item>
          </Form>
          <Container style={styles.SignUpBtnCtn}>
            <Button style={styles.SignUpBtn} rounded block light>
              <Text> Create an Account </Text>
            </Button>
          </Container>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  signUpView: {
    flex: 1,
    margin: 20
  },
  signUpForm: {
    padding: 5,
    justifyContent: "center",
    flex: 1
  },
  SignUpBtnCtn: {
    padding: 10,
    flex: 1
  },
  SignUpBtn: {
    margin: 15
  }
});
