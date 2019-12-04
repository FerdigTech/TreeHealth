import React from 'react';
import { Button, View, Image, StyleSheet } from 'react-native';

export class HomeScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />,
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button title="Go to Map" onPress={() => navigate('Map')} />
      </View>
    );
  }
}

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('./assets/logo.png')}
        resizeMode={'contain'}
        style={styles.titleImg}
      />
    );
  }
}

const styles = StyleSheet.create({
  titleImg: {
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
