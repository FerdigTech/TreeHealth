import React from 'react';
import { View, SafeAreaView, AsyncStorage, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  Form,
  Item,
  Input,
  Label
} from 'native-base';

import {LogoTitle} from '../../reusable/LogoTitle';

export class SignInScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />,
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
          <View style={styles.signInBtns}>
            <Button info>
              <Text> Sign Up </Text>
            </Button>
            <Button primary>
              <Text> Login </Text>
            </Button>
          </View>
        </Form>
        <Button style={styles.trialBtn} rounded block light onPress={this._signInTrial}>
          <Text> Try Us Out! </Text>
        </Button>
      </SafeAreaView>
    );
  }

  _signInTrial = async () => {
    await AsyncStorage.setItem('userToken', 'trial');
    this.props.navigation.navigate('Home');
  };
}

const styles = StyleSheet.create({
  signInView: {
    flex: 1,
    margin: 20,
  },
  signInForm: {
    padding: 5,
    justifyContent: 'center',
    flex: 1,
  },
  signInBtns: {
    flexDirection:'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  trialBtn: {
    marginBottom: 50,
  }
});