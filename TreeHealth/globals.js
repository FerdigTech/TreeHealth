import Constants from "expo-constants";

const ENV = {
  dev: {
    BACKEND_URL: "https://localhost"
  },
  staging: {
    BACKEND_URL: "https://dev.pinchof.tech"
  },
  prod: {
    BACKEND_URL: "https://treehealthapi.cmparks.net"
  }
 };
 
 const getEnv = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
 };
 


export default {
  SERVER_URL: getEnv().BACKEND_URL,
  COLOR: {
    DARK_BLUE: "#0f2834",
    GREEN: "#00b374"
  }
};
