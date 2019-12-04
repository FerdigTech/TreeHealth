import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {HomeScreen} from "./HomeScreen";
import {MapDisplay} from "./MapDisplay";

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Map: {screen: MapDisplay},
});

const App = createAppContainer(MainNavigator);

export default App;