import React from 'react';
import { View, AsyncStorage, StyleSheet } from 'react-native';
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
      <View style={styles.signInView}>
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
        <Button rounded block light onPress={this._signInTrial}>
          <Text> Try Us Out! </Text>
        </Button>
      </View>
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
    justifyContent: 'center',
  },
  signInForm: {
    padding: 5,
    margin: 5,
  },
  signInBtns: {
    flexDirection:'row',
    justifyContent: 'space-around',
    padding: 15,
  }
});