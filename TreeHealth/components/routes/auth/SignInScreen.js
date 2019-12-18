import React from "react";
import PropTypes from 'prop-types';
import { SafeAreaView, AsyncStorage, StyleSheet } from "react-native";
import { Button, Text, Form, Item, Input, Label, Container } from "native-base";
import globals from "../../../globals"

import { LogoTitle } from "../../reusable/LogoTitle";

export class SignInScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />
  };

  render() {
    return (
      <SafeAreaView style={styles.signInView}>
        <Form style={styles.signInForm}>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input />
          </Item>
          <Item floatingLabel last>
            <Label>Password</Label>
            <Input secureTextEntry={true} />
          </Item>
          <Container style={styles.signInBtns}>
            <Button block transparent>
              <Text> Forgot Password? </Text>
            </Button>
            <Button style={{ backgroundColor: globals.COLOR.GREEN }}>
              <Text> Login </Text>
            </Button>
          </Container>
        </Form>
        <Container style={styles.helpBtnsCtn}>
          <Button style={styles.helpBtns} rounded block light>
            <Text> Create an Account </Text>
          </Button>
          <Button style={styles.helpBtns} rounded block light onPress={this._signInTrial}>
            <Text> Try Us Out! </Text>
          </Button>
        </Container>
      </SafeAreaView>
    );
  }

  _signInTrial = async () => {
    await AsyncStorage.setItem("userToken", "trial");
    this.props.navigation.navigate("Loading");
  };
}

SignInScreen.propTypes = {
  navigation: PropTypes.object.isRequire
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
  }
});
