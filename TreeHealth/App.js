import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from './components/routes/home/HomeScreen';
import { MapDisplay } from './components/routes/map/MapDisplay';

const MainNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapDisplay },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#0f2834',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      headerTintColor: 'white',
    },
  }
);

const App = createAppContainer(MainNavigator);

export default App;
