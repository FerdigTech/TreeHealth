import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {HomeList} from "./HomeList"
export class HomeScreen extends React.Component {
  static navigationOptions = {
    // Use logo instead of text
    headerTitle: () => <LogoTitle />,
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.listLayout}>
        <HomeList menuAction={() => navigate('Map')} iconName="map" menuName="About Us"/>
        <HomeList menuAction={() => navigate('Map')} iconName="map" menuName="Introduction"/>
        <HomeList menuAction={() => navigate('Map')} iconName="map" menuName="Projects"/>
        <HomeList menuAction={() => navigate('Map')} iconName="help-circle" menuName="Project Questions"/>
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
  listLayout: {
    justifyContent: 'space-around',
    flex: 1,
  },
});
