import React from 'react';
import MapView from 'react-native-map-clustering';
import { Marker, Callout } from 'react-native-maps';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  Text,
  Modal,
  Image,
  StatusBar,
  Button,
} from 'react-native';

export class MapDisplay extends React.Component {
  // initalize the default values in state
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      mapPts: {},
    };
  }

  // this is for the fetch await and async component mount
  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  // Get all the map points from the site
  async componentDidMount() {
    StatusBar.setNetworkActivityIndicatorVisible(true);
    const res = await fetch(
      'https://parkapps.kent.edu/demo/adminpoints/Indexpoints.geojson'
    );
    const { points } = await res.json();
    StatusBar.setNetworkActivityIndicatorVisible(false);
    await this.setStateAsync({ mapPts: points });
  }

  toggleVisibility() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <StatusBar
            style={styles.statusBar}
            backgroundColor="blue"
            barStyle="light-content"
          />
          <MapView style={styles.mapStyle} initialRegion={zoomNEOhio.region}>
            <Marker
              coordinate={{
                longitude: -81.4899204,
                latitude: 41.50191905,
              }}
              title={'Acacia Clubhouse'}
              onPress={() => this.toggleVisibility()}
            />
            <Marker
              coordinate={{
                longitude: -81.52245312,
                latitude: 41.53738951,
              }}
              title={'Euclid Creek Management Office'}
              onPress={() => this.toggleVisibility()}
            />
            <Marker
              coordinate={{
                longitude: -81.52248681,
                latitude: 41.53940433,
              }}
              title={'Rear Quarry'}
              onPress={() => this.toggleVisibility()}
            />
          </MapView>
          <MarkerModal
            show={this.state.modalVisible}
            handleClose={() => this.toggleVisibility()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

class MarkerModal extends React.Component {
  render() {
    return (
      <Modal style={styles.markerModal} visible={this.props.show}>
        <ScrollView stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}>
          <Button style={styles.modalButton} onPress={this.props.handleClose} title={"Close"}/>
          <Image
            style={styles.modalImg}
            source={require('./assets/treehouse-default.png')}
          />
          <Text style={styles.modalText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </Modal>
    );
  }
}

const zoomNEOhio = {
  region: {
    latitude: 41.215078,
    longitude: -81.562843,
    latitudeDelta: 3 / 4,
    longitudeDelta: 3 / 4,
  },
};

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === 'ios' ? 20 : 0,
    zIndex: 3,
  },
  modalButton: {
    width: "100%",
    zIndex: 2,
  },
  modalText: {
    fontSize: 20,
    margin: "5%",
    marginTop: 0,
  },
  modalImg: {
    width: "90%",
    margin: "5%",
    marginTop: 15,
    paddingTop: 15,
    flex: 1,
  },
  markerModal: {
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },
});

