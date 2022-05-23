import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { ProjectWrapper } from './context/ProjectWrapper';
import NavigationService from './services/NavigationService';
import InitalNavigator from './components/navagators/Navagators';
import { useFonts } from 'expo-font';
import globals from './globals';

const App = () => {
  const [loaded] = useFonts({
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar
        animated={true}
        barStyle={'light-content'}
        showHideTransition={'fade'}
        hidden={false}
      />
      <SafeAreaView style={styles.container}>
        <ProjectWrapper>
          <InitalNavigator
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </ProjectWrapper>
      </SafeAreaView>
      <SafeAreaView style={styles.containerBottom} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globals.COLOR.DARK_BLUE,
  },
  containerBottom: {},
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;
