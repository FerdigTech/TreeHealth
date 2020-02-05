import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import {
  Button,
  Text,
  Form,
  Item,
  Input,
  Label,
  Container,
  Picker,
  Icon,
  CheckBox,
  Toast
} from "native-base";
import { LogoTitle } from "../../reusable/LogoTitle";
import { ProjectContext } from "../../../context/ProjectProvider";
import { getAffilations, getRoles } from "./../../../services/FetchService";

export const RegisterScreen = () => {
  const [Answers, setAnswers] = useState({});
  const [Affilations, setAffilations] = useState([]);
  const [UserRoles, setUserRoles] = useState([]);
  const context = useContext(ProjectContext);

  useEffect(() => {
    getAffilations(aff => setAffilations(aff));
    getRoles(roles => setUserRoles(roles));
    setAnswers({
      name: "",
      email: "",
      password: "",
      affliation: -1,
      roleid: -1,
      thirteen: false,
      data: false,
      tos: false
    });
  }, []);

  const validateAndError = () => {
    let errors = [];
    // email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Answers.email)) {
      errors = [...errors, "Invalid email address"];
    }
    // password
    if (Answers.password.length < 8) {
      errors = [
        ...errors,
        "Your password should be at least 8 characters long."
      ];
    }
    return errors;
  };

  const notValid =
    Answers.name == "" ||
    Answers.email == "" ||
    Answers.password == "" ||
    Answers.roleid < 0 ||
    !Answers.thirteen ||
    !Answers.tos;

  const handleSignUp = () => {
    const errors = validateAndError();
    if (errors.length == 0) {
      context.processSignup(
        Answers.name,
        Answers.email,
        Answers.password,
        Answers.affliation,
        Answers.roleid
      );
    } else {
      Toast.show({
        text: errors.join(" and "),
        buttonText: "Okay",
        type: "warning",
        position: "top",
        duration: 3000
      });
    }
  };

  return (
    <SafeAreaView style={styles.signUpView}>
      <ScrollView>
        <Form style={styles.signUpForm}>
          <Item floatingLabel>
            <Label style={styles.labels}>Name</Label>
            <Input
              onChangeText={text => setAnswers({ ...Answers, name: text })}
              autoCompleteType={"name"}
              style={styles.inputs}
            />
          </Item>
          <Item floatingLabel>
            <Label style={styles.labels}>Email</Label>
            <Input
              onChangeText={e => setAnswers({ ...Answers, email: text })}
              autoCompleteType={"email"}
              keyboardType={"email-address"}
              style={styles.inputs}
            />
          </Item>
          <Item floatingLabel>
            <Label style={styles.labels}>Password</Label>
            <Input
              onChangeText={e => setAnswers({ ...Answers, password: text })}
              style={styles.inputs}
              autoCompleteType={"password"}
              secureTextEntry={true}
            />
          </Item>
          <Item picker style={styles.pickers}>
            <Picker
              note
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Select Role"
              placeholderStyle={styles.labels}
              placeholderIconColor="#000"
              onValueChange={value => setAnswers({ ...Answers, roleid: value })}
              selectedValue={Answers.roleid}
            >
              {UserRoles.map(role => {
                return (
                  <Picker.Item
                    label={role.name}
                    value={role.roleid}
                    key={role.roleid}
                  />
                );
              })}
            </Picker>
          </Item>
          <Item picker style={styles.pickers}>
            <Picker
              note
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Select Affliation"
              placeholderStyle={styles.labels}
              placeholderIconColor="#000"
              onValueChange={value =>
                setAnswers({ ...Answers, affliation: value })
              }
              selectedValue={Answers.affliation}
            >
              <Picker.Item label={"None"} value={-1} />
              {Affilations.map(affliate => {
                return (
                  <Picker.Item
                    label={affliate.name}
                    value={affliate.affiliationid}
                    key={affliate.affiliationid}
                  />
                );
              })}
            </Picker>
          </Item>
          <Item style={styles.checkboxes}>
            <Label style={styles.labels}>Atleast 14 years old?</Label>
            <CheckBox
              onPress={() =>
                setAnswers({ ...Answers, thirteen: !Answers.thirteen })
              }
              checked={Answers.thirteen}
              color="black"
            />
          </Item>
          <Item style={styles.checkboxes}>
            <Label style={styles.labels}>Request Data Access?</Label>
            <CheckBox
              onPress={() => setAnswers({ ...Answers, data: !Answers.data })}
              checked={Answers.data}
              color="black"
            />
          </Item>
          <View style={styles.terms}>
            <Text>I agree to the terms</Text>
            <CheckBox
              onPress={() => setAnswers({ ...Answers, tos: !Answers.tos })}
              checked={Answers.tos}
              color="black"
            />
          </View>
        </Form>
        <Container style={styles.SignUpBtnCtn}>
          <Button
            onPress={() => {
              handleSignUp();
            }}
            style={styles.SignUpBtn}
            rounded
            block
            light
            disabled={notValid}
          >
            <Text> Create an Account </Text>
          </Button>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};
RegisterScreen.navigationOptions = {
  // Use logo instead of text
  headerTitle: () => <LogoTitle />
};

const styles = StyleSheet.create({
  signUpView: {
    margin: 20
  },
  signUpForm: {
    padding: 5,
    justifyContent: "center",
    flex: 1
  },
  SignUpBtnCtn: {
    padding: 10
  },
  SignUpBtn: {
    margin: 15
  },
  labels: {
    color: "#808080",
    paddingLeft: 10
  },
  pickers: {
    marginLeft: 15
  },
  checkboxes: {
    paddingTop: 5,
    paddingBottom: 5
  },
  terms: {
    paddingTop: 15,
    paddingLeft: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  inputs: {
    paddingLeft: 10
  }
});
