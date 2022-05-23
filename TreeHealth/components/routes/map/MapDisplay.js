import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
} from 'react-native';
import { Container, Content, Text, Icon, Button } from 'native-base';
import { FooterTabs } from '../../reusable/FooterTabs';
import { TitleDrop } from '../../reusable/TitleDrop';
import { FilterModal } from '../../reusable/FilterModal';
import NavigationService from '../../../services/NavigationService';
import { ProjectConsumer } from '../../../context/ProjectProvider';
import { AnswerModal } from '../../reusable/AnswerModal';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Moment from 'moment';
import RBush from 'rbush';

export const MapDisplay = (props) => {
  const [showSearch, setShowSearch] = useState(false);
  const [Points, setPoints] = useState([]);
  const [CurrentPoint, setCurrentPoint] = useState(null);
  const [currentProject] = useState(
    props.navigation.getParam('projectName', 'All')
  );
  const [location, setLocation] = useState(null);
  const [errorMessage, setError] = useState(null);
  const mapType = props.navigation.getParam('mapType', 'standard');

  let mapRef = null;
  const tree = new RBush();

  // from the filter
  const DropDownVisible = props.navigation.getParam('DropDownVisible', false);
  const Operator = props.navigation.getParam('Operator', 'none');
  const FilterAffilation = props.navigation.getParam('FilterAffilation', false);
  const OnlyAffilation = props.navigation.getParam('OnlyAffilation', false);
  const EndDateFilter = props.navigation.getParam('EndDateFilter', '');
  const dateFilter = props.navigation.getParam('dateFilter', '');
  const VisibleMarkers = props.navigation.getParam('VisibleMarkers', '');

  const _onRegionChangeComplete = (region) => {
    let { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    // Get points that are inside the region.
    const visibleItems = tree.search({
      // Provide the coordinates of the south-west, north-east corners of the region.
      minX: region.longitude - region.longitudeDelta * ASPECT_RATIO,
      minY: region.latitude - region.latitudeDelta * ASPECT_RATIO,
      maxX: region.longitude + region.longitudeDelta * ASPECT_RATIO,
      maxY: region.latitude + region.latitudeDelta * ASPECT_RATIO,
    });
    props.navigation.setParams({
      VisibleMarkers: visibleItems,
    });
  };

  const _getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    } else {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      }).then((location) => {
        setLocation(location);
      });
    }
  };

  const searchAndFocus = (text) => {
    const filteredPts = Points.filter((point) => {
      const titleText = point.title + ' - ' + point.county;
      return titleText.toLowerCase().includes(text.toLowerCase());
    });

    // if there is a result of point's title containing the text
    if (filteredPts.length > 0) {
      // get the last item
      const lastPoint = filteredPts.pop();
      // extract them in proper form
      const coordinate = {
        longitude: parseFloat(lastPoint.longitude),
        latitude: parseFloat(lastPoint.latitude),
      };

      mapRef.fitToCoordinates([coordinate], { animated: true });
    }
  };

  useEffect(() => {
    _getLocationAsync();
  }, []);

  const toggleDropVis = () => {
    props.navigation.setParams({
      DropDownVisible: true,
    });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Container>
          <MapView
            ref={(ref) => {
              mapRef = ref;
            }}
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            initialRegion={zoomNEOhio.region}
            showsUserLocation={true}
            showsTraffic={false}
            mapType={mapType}
            loadingEnabled={true}
            cacheEnabled={true}
            onRegionChangeComplete={_onRegionChangeComplete}
          >
            <ProjectConsumer>
              {(context) => {
                setPoints(context.Points);
                tree.load(
                  context.Points.map((point) => {
                    return {
                      minY: parseFloat(point.latitude),
                      minX: parseFloat(point.longitude),
                      maxY: parseFloat(point.latitude),
                      maxX: parseFloat(point.longitude),
                    };
                  })
                );
              }}
            </ProjectConsumer>
            {Points.filter((point) => !FilterAffilation || !point.affiliationid)
              .filter((point) => !OnlyAffilation || point.affiliationid)
              .filter(
                (point) =>
                  Operator != 'before' ||
                  Moment(point.createddate).isSameOrBefore(Moment(dateFilter))
              )
              .filter(
                (point) =>
                  Operator != 'after' ||
                  Moment(point.createddate).isSameOrAfter(Moment(dateFilter))
              )
              .filter(
                (point) =>
                  Operator != 'dayof' ||
                  Moment(point.createddate).isSame(Moment(dateFilter), 'day')
              )
              .filter(
                (point) =>
                  Operator != 'range' ||
                  (Moment(point.createddate).isSameOrAfter(
                    Moment(dateFilter)
                  ) &&
                    Moment(point.createddate).isSameOrBefore(
                      Moment(EndDateFilter)
                    ))
              )
              .map((point, index) => {
                return (
                  <Marker
                    coordinate={{
                      longitude: parseFloat(point.longitude),
                      latitude: parseFloat(point.latitude),
                    }}
                    title={
                      (point.title ? point.title : 'no title') +
                      ' - ' +
                      point.county
                    }
                    // seems like when rerendering, react uses the key to update
                    // which can cause some colors to appear wrong, this can be fixed by passing a customID for each location
                    // see more at https://github.com/react-native-community/react-native-maps/issues/1611#issuecomment-334619684
                    key={Number.parseInt(
                      index.toString() + Date.now().toString()
                    )}
                    onPress={() => setCurrentPoint(point.locationid)}
                    pinColor={
                      point.approvalstatus !== 'Approved'
                        ? 'yellow'
                        : point.affiliationid
                        ? 'blue'
                        : 'red'
                    }
                    // TODO: once a user drags a point, it should bring them to the edit screen
                    // seems like there is no way to uniquely identify a point
                    onDragEnd={() => {}}
                  >
                    <Callout>
                      <View>
                        <Text>
                          {'Title: ' + (point.title ? point.title : 'no title')}
                        </Text>
                        <Text>{'County: ' + point.county}</Text>
                        <Text>{'Created: ' + point.formatedcreateddate}</Text>
                      </View>
                    </Callout>
                  </Marker>
                );
              })}
          </MapView>
        </Container>
        <FilterModal navigation={props.navigation} />
        {CurrentPoint != null && (
          <AnswerModal
            navigation={props.navigation}
            locationid={CurrentPoint}
            closeModal={() => setCurrentPoint(null)}
          />
        )}
        {showSearch && (
          <Callout>
            <View style={styles.calloutView}>
              <TextInput
                style={styles.calloutSearch}
                placeholder={'Search'}
                onEndEditing={(e) => searchAndFocus(e.nativeEvent.text)}
              />
            </View>
          </Callout>
        )}
      </SafeAreaView>
      <SafeAreaView style={styles.containerBottom}>
        <FooterTabs
          listIcon="list"
          switchView={() =>
            NavigationService.navigate('RecordList', {
              projectName: currentProject,
              Operator,
              FilterAffilation,
              OnlyAffilation,
              EndDateFilter,
              dateFilter,
              VisibleMarkers,
            })
          }
          funnelToggle={() => toggleDropVis()}
          SearchToggle={() => {
            setShowSearch(!showSearch);
          }}
          addItemAction={() =>
            NavigationService.navigate('AddPoint', {
              projectName: currentProject,
            })
          }
        />
      </SafeAreaView>
    </>
  );
};

MapDisplay.navigationOptions = ({ navigation, navigationOptions }) => ({
  headerTitle: () => (
    <TitleDrop
      navigation={navigation}
      projectName={navigation.getParam('projectName', 'All')}
    />
  ),
  headerRight: () => (
    <Button
      onPress={() =>
        navigation.setParams({
          mapType:
            navigation.getParam('mapType', 'standard') != 'standard'
              ? 'standard'
              : 'satellite',
        })
      }
      transparent
    >
      <Icon
        style={{
          color: navigationOptions.headerTintColor,
          paddingLeft: 24,
          fontSize: 24,
        }}
        type="Feather"
        name={'eye'}
      />
    </Button>
  ),
});

const zoomNEOhio = {
  region: {
    latitude: 41.215078,
    longitude: -81.562843,
    latitudeDelta: 3 / 4,
    longitudeDelta: 3 / 4,
  },
};

const styles = StyleSheet.create({
  calloutView: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    width: '40%',
    marginLeft: '30%',
    marginRight: '30%',
    marginTop: 10,
  },
  calloutSearch: {
    borderColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
    width: '90%',
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBottom: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },
});
