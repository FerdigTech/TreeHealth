import React from 'react';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MarkerModal } from './MarkerModal';

export class MapDisplay extends React.Component {
  static navigationOptions = {
    title: 'Map',
  };
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

    const points = await fetch("https://127.0.0.1:8000/Indexpoints.geojson")
    .then((response) => response.json())
    .catch(function(error) {
      console.log(error.message);
      throw error;
    });

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
