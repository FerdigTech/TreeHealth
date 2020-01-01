import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import {
  Button,
  Text,
  Form,
  Item,
  Input,
  Label,
  Container,
  DatePicker,
  Picker,
  Icon,
  CheckBox
} from "native-base";
import { LogoTitle } from "../../reusable/LogoTitle";

export class RegisterScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />
  };

  render() {
    const today = new Date();
    const today_13_yrs_ago = new Date().setFullYear(today.getFullYear() - 13);
    return (
      <SafeAreaView style={styles.signUpView}>
        <ScrollView>
          <Form style={styles.signUpForm}>
            <Item floatingLabel>
              <Label style={styles.labels}>Name</Label>
              <Input style={styles.inputs}/>
            </Item>
            <Item floatingLabel>
              <Label style={styles.labels}>Email</Label>
              <Input style={styles.inputs}/>
            </Item>
            <Item floatingLabel>
              <Label style={styles.labels}>Password</Label>
              <Input style={styles.inputs} secureTextEntry={true} />
            </Item>
            <Item picker style={styles.pickers}>
              <Picker
                note
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select Affliation"
                placeholderStyle={styles.labels}
                placeholderIconColor="#000"
              >
                <Picker.Item label="Affliation 1" value="affliation1" />
                <Picker.Item label="Affliation 2" value="affliation2" />
              </Picker>
            </Item>
            <Item picker style={styles.pickers}>
              <DatePicker
                maximumDate={today_13_yrs_ago}
                locale={"en"}
                placeHolderText="Select Birthday"
                placeHolderTextStyle={styles.labels}
              />
            </Item>
            <Item style={styles.checkboxes}>
              <Label style={styles.labels}>Request Data Access?</Label>
              <CheckBox checked={false} color="black"/>
            </Item>
            <View style={styles.terms}>
              <Text>I agree to the terms</Text>
              <CheckBox checked={false} color="black"/>
            </View>
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
    flexDirection: 'row',
    justifyContent: "center"
  },
  inputs: {
    paddingLeft: 10
  }
});
