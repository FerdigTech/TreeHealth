import React, { useState, useEffect } from "react";
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
  CheckBox
} from "native-base";
import { LogoTitle } from "../../reusable/LogoTitle";

export const RegisterScreen = () => {
  const [Answers, setAnswers] = useState({});

  useEffect(() => {
    setAnswers({
      name: "",
      email: "",
      password: "",
      affliation: null,
      thirteen: false,
      data: false,
      tos: false
    });
  }, []);

  const notValid = Answers.name == "" || Answers.email == "" || Answers.password == "" || !Answers.thirteen || !Answers.tos;

  const handleSignUp = () => {
    // should hit /userAccount/create
    // and give name, email and password
  };

  return (
    <SafeAreaView style={styles.signUpView}>
      <ScrollView>
        <Form style={styles.signUpForm}>
          <Item floatingLabel>
            <Label style={styles.labels}>Name</Label>
            <Input
              onEndEditing={e =>
                setAnswers({ ...Answers, name: e.nativeEvent.text })
              }
              autoCompleteType={"name"}
              style={styles.inputs}
            />
          </Item>
          <Item floatingLabel>
            <Label style={styles.labels}>Email</Label>
            <Input
              onEndEditing={e =>
                setAnswers({ ...Answers, email: e.nativeEvent.text })
              }
              autoCompleteType={"email"}
              keyboardType={"email-address"}
              style={styles.inputs}
            />
          </Item>
          <Item floatingLabel>
            <Label style={styles.labels}>Password</Label>
            <Input
              onEndEditing={e =>
                setAnswers({ ...Answers, password: e.nativeEvent.text })
              }
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
              placeholder="Select Affliation"
              placeholderStyle={styles.labels}
              placeholderIconColor="#000"
              onValueChange={value =>
                setAnswers({ ...Answers, affliation: value })
              }
              selectedValue={Answers.affliation}
            >
              <Picker.Item label="Affliation 1" value="affliation1" />
              <Picker.Item label="Affliation 2" value="affliation2" />
            </Picker>
          </Item>
          <Item style={styles.checkboxes}>
            <Label style={styles.labels}>Atleast 13 years old?</Label>
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
              onPress={() =>
                setAnswers({ ...Answers, data: !Answers.data })
              }
              checked={Answers.data}
              color="black"
            />
          </Item>
          <View style={styles.terms}>
            <Text>I agree to the terms</Text>
            <CheckBox
              onPress={() =>
                setAnswers({ ...Answers, tos: !Answers.tos })
              }
              checked={Answers.tos}
              color="black"
            />
          </View>
        </Form>
        <Container style={styles.SignUpBtnCtn}>
          <Button
            onPress={() => {handleSignUp()}}
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
