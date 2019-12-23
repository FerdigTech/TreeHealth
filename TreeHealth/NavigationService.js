import { NavigationActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params = null) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function setParams(params, key) {
  _navigator.dispatch(
    NavigationActions.setParams({
      params,
      key
    })
  );
}

export default {
  navigate,
  setParams,
  setTopLevelNavigator
};
