import React, { useEffect, useState, useReducer } from "react";
import ProjectContext from "./ProjectProvider";
import { AsyncStorage } from "react-native";
import globals from "../globals";
import { useNetInfo } from "@react-native-community/netinfo";
import NavigationService from "../services/NavigationService";
import { Toast, Root } from "native-base";
import * as SecureStore from "expo-secure-store";

const ProjectProvider = ProjectContext.Provider;

const setProjectData = async data => {
  return await AsyncStorage.setItem("Projects", JSON.stringify(data));
};
// try to get the Project data from cache, if not get from the site.
getProjectData = async (forceUpdate = false) => {
  let projectData = await AsyncStorage.getItem("Projects");
  if (projectData !== null && !forceUpdate) {
    projectData = JSON.parse(projectData);
  } else {
    projectData = await fetch(globals.SERVER_URL + "/projects/", {
      cache: "no-store"
    }).then(response => response.json());
    // TODO: if offline/fails, we should try return cache and that it failed to get updated data
    // Since AsyncStorage is immunitable, the projects object should be deleted before being set
    if (projectData !== null) {
      await AsyncStorage.removeItem("Projects").then(() => {
        setProjectData(projectData);
      });
    } else {
      setProjectData(projectData);
    }
  }
  return projectData;
};

const processProjData = (forceUpdate = false) => {
  return new Promise(resolve => {
    resolve(getProjectData(forceUpdate));
  });
};

// use hook to get the project data
const useProjects = () => {
  const [Projects, setProjects] = useState([]);
  useEffect(() => {
    processProjData(false).then(results => {
      setProjects(results);
    });
  }, []);
  return { Projects, setProjects };
};

// try to get the  point data from cache, if not get from the site.
getPointData = async ID => {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  let pointsData = await AsyncStorage.getItem("Points");
  if (pointsData !== null) {
    // get all the storied points and filter the ones with the correct ID
    pointsData = JSON.parse(pointsData);
    pointsData.result = pointsData.result.filter(
      points => points.projectid == ID
    );
  } else {
    AllPoints = await fetch(globals.SERVER_URL + "/locationByProject/", {
      cache: "no-store"
    }).then(response => response.json());
    pointsData = await fetch(
      globals.SERVER_URL + "/locationByProject/" + projectID,
      {
        cache: "no-store"
      }
    ).then(response => response.json());
    await AsyncStorage.setItem("Points", JSON.stringify(AllPoints));
  }
  return pointsData;
};

const processPntData = ID => {
  return new Promise(resolve => {
    resolve(getPointData(ID));
  });
};

// use hook to get the data
const usePoints = () => {
  const [Points, setPoints] = useState([]);
  useEffect(() => {
    processPntData(-1).then(results => {
      setPoints(results);
    });
  }, []);
  return { Points, setPoints };
};

const OfflineReducer = (state, action) => {
  switch (action.type) {
    case "add":
      Toast.show({
        text: "Your record has been added to the queue.",
        buttonText: "Okay",
        type: "warning",
        position: "top",
        duration: 3000
      });
      waitAndUpdateStorage({ items: [...state.items, action.payload] });
      return { items: [...state.items, action.payload] };
    case "pop":
      Toast.show({
        text: "Your record(s) has been uploaded to the server.",
        buttonText: "Okay",
        type: "success",
        position: "top",
        duration: 3000
      });
      waitAndUpdateStorage({ items: state.items.filter((_, i) => i !== 0) });
      return { items: state.items.filter((_, i) => i !== 0) };
    case "set":
      return action.payload;
    case "sendAnswers":
      fetch(globals.SERVER_URL + "/answer/create", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          questionid: action.payload.questionid,
          answeredby: action.payload.userid,
          answer: action.payload.answer,
          locationid: action.payload.locationID
        })
      }).then(res => {
        if (res.ok) {
          const oldStateItems = state.items;
          delete oldStateItems[0].answers[action.payload.questionid];
          return { items: [...oldStateItems] };
        }
      });

      return state;
    default:
      throw new Error();
  }
};
const generateUser = async (name, email, password) => {
  const RequestResult = await fetch(
    globals.SERVER_URL.toString() + "/userAccount/create/",
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password
      })
    }
  ).then(res => res.json());
  return RequestResult;
};

const processSignup = (name, email, pass) => {
  return new Promise(resolve => {
    resolve(generateUser(name, email, pass));
  });
};

const generateUserToken = async (email, password) => {
  const UserData = await fetch(
    globals.SERVER_URL.toString() + "/userAccount/validate/",
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }
  ).then(res => res.json());
  await SecureStore.setItemAsync("userToken", UserData.userid.toString());
  await SecureStore.setItemAsync("userAuth", UserData.secret.toString());
  return UserData;
};

const processLogin = (email, password) => {
  return new Promise(resolve => {
    resolve(generateUserToken(email, password));
  });
};

const generateLocationID = async (longitude, latitude, projectid, userid) => {
  const locationID = await fetch(
    globals.SERVER_URL.toString() + "/location/create/",
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        projectid: projectid,
        createdby: userid,
        // TODO: find a way to creatively make a title
        title: "test"
      })
    }
  )
    .then(res => res.json())
    .then(response => {
      return response.projectid;
    })
    .catch(err => {
      return -1;
    });
  return locationID;
};

const processLocationID = (longitude, latitude, projectid, userid) => {
  return new Promise(resolve => {
    resolve(generateLocationID(longitude, latitude, projectid, userid));
  });
};

const getUserInfo = async () => {
  const asyncUserID = await SecureStore.getItemAsync("userToken");
  const asyncToken = await SecureStore.getItemAsync("userAuth");
  return { asyncUserID, asyncToken };
};
const processUserAuth = () => {
  return new Promise(resolve => {
    resolve(getUserInfo());
  });
};

const updateStorage = async value => {
  const oldStorage = await AsyncStorage.getItem("offlineQueue");
  if (oldStorage != null) {
    await AsyncStorage.removeItem("offlineQueue");
  }
  await AsyncStorage.setItem("offlineQueue", JSON.stringify(value));
};
const waitAndUpdateStorage = value => {
  return new Promise(resolve => {
    resolve(updateStorage(value));
  });
};

const getQueueFromStorage = async () => {
  const asyncUserID = await AsyncStorage.getItem("offlineQueue");
  return JSON.parse(asyncUserID);
};
const loadStoredQueue = () => {
  return new Promise(resolve => {
    resolve(getQueueFromStorage());
  });
};

// Build the provider
export const ProjectWrapper = ({ children }) => {
  const ProjectsObj = useProjects();
  const Projects = ProjectsObj.Projects;
  const setProjects = ProjectsObj.setProjects;

  const [ProjectID, setProjectID] = useState(-1);
  const [ProjectName, setProjectName] = useState("");

  const PointsObj = usePoints();
  const Points = PointsObj.Points;
  const setPoints = PointsObj.setPoints;

  const [ForceQueue, setForceQueue] = useState(false);

  const [OfflineStateQ, dispatcher] = useReducer(
    OfflineReducer,
    { items: [] },
    () => {
      return { items: [] };
    }
  );

  const offlineQueueLoad = loadStoredQueue().then(res => {
    // if more things are in the backstorage than current queue than we need to update
    if (res != null && OfflineStateQ.items.length < res.items.length) {
      dispatcher({
        type: "set",
        payload: res
      });
    }
  });

  const [UserID, setUserID] = useState(null);

  const userInfo = processUserAuth().then(res => {
    if (res.asyncUserID != UserID && res.asyncToken != AuthToken) {
      setUserID(res.asyncUserID != null ? parseInt(res.asyncUserID) : null);
      setAuthToken(res.asyncToken != null ? parseInt(res.asyncToken) : null);
    }
  });

  const [AuthToken, setAuthToken] = useState(null);

  const HandleSignup = (name, email, pass) => {
    processSignup(name, email, pass).then(results => {
      if (results.hasOwnProperty("result")) {
        if (results.result) {
          Toast.show({
            text: "Your account has successfully been created!",
            buttonText: "Okay",
            type: "success",
            position: "top",
            duration: 3000
          });
          // TODO: Log the user in here?
        }
      } else {
        Toast.show({
          text:
            "Something went wrong with the account creation process, try again.",
          buttonText: "Okay",
          type: "danger",
          position: "top",
          duration: 3000
        });
      }
    });
  };

  const HandleLogin = (email, pass) => {
    processLogin(email, pass).then(results => {
      if (results.hasOwnProperty("userid")) {
        setUserID(results.userid);
        setAuthToken(results.secret);
        NavigationService.navigate("Loading");
      } else {
        Toast.show({
          text: "Wrong username or password!",
          buttonText: "Okay",
          type: "danger",
          position: "top",
          duration: 3000
        });
      }
    });
  };

  const HandleLogout = async() => {
    setUserID(null);
    setAuthToken(null);
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userAuth");
  };

  const netInfo = useNetInfo();

  const processAsync = async (answer, questionid, locationID, userid) => {
    return await dispatcher({
      type: "sendAnswers",
      payload: { answer, questionid, locationID, userid }
    });
  };

  useEffect(
    () => {
      // if online we should try to push all the data in offline queue
      if (netInfo.isConnected) {
        // the reducer seems to initalize to undefined, this is to prevent it from going on
        if (typeof OfflineStateQ.items !== "undefined") {
          // something is in the queue
          if (OfflineStateQ.items.length > 0) {
            // if the location ID hasn't been set
            if (!OfflineStateQ.items[0].hasOwnProperty("LocationID")) {
              // get the coordinates and convert it to a coordinateID
              const {
                longitude,
                latitude
              } = OfflineStateQ.items[0].location.coords;

              // once we get the ID for the location
              processLocationID(
                longitude,
                latitude,
                (projectid = ProjectID),
                (userid = UserID)
              ).then(locationID => {
                if (locationID != -1) {
                  // on sucesss copy state
                  let StateCopy = Object.assign({}, OfflineStateQ);
                  // create property LocationID and set it
                  StateCopy.items[0].LocationID = locationID;
                  // update our global state
                  dispatcher({ type: "set", payload: StateCopy });
                  // push to the server

                  Promise.all(
                    StateCopy.items[0].answers.map((answer, questionid) =>
                      processAsync(
                        answer,
                        questionid,
                        locationID,
                        (userid = UserID)
                      )
                    )
                  ).then(() => {
                    dispatcher({
                      type: "pop"
                    });
                  });
                }
              });
            } else {
              // push to the server
              Promise.all(
                OfflineStateQ.items[0].answers.map((answer, questionid) =>
                  processAsync(
                    answer,
                    questionid,
                    OfflineStateQ.items[0].LocationID,
                    (userid = UserID)
                  )
                )
              ).then(() => {
                dispatcher({
                  type: "pop"
                });
              });
            }
          }
        }
      }
    },
    // if change in item queue or net connectivity try to do something
    [OfflineStateQ.items, netInfo.isConnected, ForceQueue]
  );

  return (
    <ProjectProvider
      value={{
        Projects:
          Projects !== "undefined"
            ? Projects.hasOwnProperty("result")
              ? Projects.result
              : []
            : [],
        Points:
          Points !== "undefined"
            ? Points.hasOwnProperty("result")
              ? Points.result
              : []
            : [],
        setProjectID: ID => {
          processPntData(ID).then(results => {
            setPoints(results);
            setProjectID(ID);
            setProjectName(
              Projects !== "undefined"
                ? Projects.hasOwnProperty("result")
                  ? Projects.result.filter(
                      project => project.projectid == ID
                    )[0].name
                  : Projects.filter(project => project.projectid == ID)[0].name
                : ""
            );
          });
        },
        ProjectID,
        ProjectName,
        updateProjects: () => {
          processProjData(true).then(results => {
            setProjects(results);
          });
        },
        OfflineQueue: OfflineStateQ.items,
        addToOfflineQueue: locationItem => {
          dispatcher({ type: "add", payload: locationItem });
        },
        forceSendQueue: () => {
          setForceQueue(!ForceQueue);
        },
        processSignup: (name, email, pass) => HandleSignup(name, email, pass),
        processLogin: (email, pass) => HandleLogin(email, pass),
        processLogout: () => HandleLogout(),
        UserID,
        AuthToken
      }}
    >
      <Root>{children}</Root>
    </ProjectProvider>
  );
};
