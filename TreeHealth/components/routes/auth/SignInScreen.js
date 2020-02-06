import React, { useState, useEffect, useContext, Fragment } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Text, Form, Item, Input, Label, Container } from "native-base";
import globals from "../../../globals";
import NavigationService from "../../../services/NavigationService";
import { LogoTitle } from "../../reusable/LogoTitle";
import { ProjectContext } from "../../../context/ProjectProvider";
import * as SecureStore from "expo-secure-store";

export const SignInScreen = () => {
  const [Answers, setAnswers] = useState({});
  const [Processing, setProcessing] = useState(false);
  const context = useContext(ProjectContext);

  useEffect(() => {
    setAnswers({
      email: "",
      password: ""
    });
  }, []);

  _signInTrial = async () => {
    await SecureStore.setItemAsync("userToken", "trial");
    NavigationService.navigate("Loading");
  };

  _handleLogin = () => {
    setProcessing(true);
    context.processLogin(Answers.email, Answers.password, status =>
      setProcessing(status)
    );
  };

  return (
    <SafeAreaView style={styles.signInView}>
      {Processing ? (
        <Container style={styles.loadingView}>
          <ActivityIndicator />
        </Container>
      ) : (
        <React.Fragment>
          <Form style={styles.signInForm}>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCompleteType={"email"}
                keyboardType={"email-address"}
                onChangeText={text => setAnswers({ ...Answers, email: text })}
              />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                onChangeText={text =>
                  setAnswers({ ...Answers, password: text })
                }
              />
            </Item>
            <Container style={styles.signInBtns}>
              <Button
                onPress={() =>
                  NavigationService.navigate("Forget", { email: Answers.email })
                }
                block
                transparent
              >
                <Text> Forgot Password? </Text>
              </Button>
              <Button
                onPress={() => _handleLogin()}
                style={{ backgroundColor: globals.COLOR.GREEN }}
              >
                <Text> Login </Text>
              </Button>
            </Container>
          </Form>

          <Container style={styles.helpBtnsCtn}>
            <Button
              onPress={() => NavigationService.navigate("Register")}
              style={styles.helpBtns}
              rounded
              block
              light
            >
              <Text> Create an Account </Text>
            </Button>
            <Button
              style={styles.helpBtns}
              rounded
              block
              light
              onPress={_signInTrial}
            >
              <Text> Try Us Out! </Text>
            </Button>
          </Container>
        </React.Fragment>
      )}
    </SafeAreaView>
  );
};

SignInScreen.navigationOptions = {
  // Use logo instead of text
  headerTitle: () => <LogoTitle />,
  headerRight: null
};

const styles = StyleSheet.create({
  signInView: {
    flex: 1,
    margin: 20
  },
  signInForm: {
    padding: 5,
    justifyContent: "center",
    flex: 1
  },
  helpBtnsCtn: {
    justifyContent: "flex-end",
    padding: 10,
    flex: 1
  },
  helpBtns: {
    margin: 15
  },
  signInBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 30
  },
  loadingView: {
    flex: 1,
    justifyContent: "center"
  }
});
