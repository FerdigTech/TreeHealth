import React, { useEffect, useState, useReducer } from "react";
import ProjectContext from "./ProjectProvider";
import { AsyncStorage } from "react-native";
import globals from "../globals";
import { useNetInfo } from "@react-native-community/netinfo";
import NavigationService from "../services/NavigationService";
import { Toast, Root } from "native-base";
import * as SecureStore from "expo-secure-store";
import { decode } from "base-64";

const ProjectProvider = ProjectContext.Provider;

const setProjectData = async data => {
  return await AsyncStorage.setItem("Projects", JSON.stringify(data));
};
// try to get the Project data from cache, if not get from the site.
getProjectData = async (forceUpdate = false, UserID, AuthToken = "") => {
  let projectData = await AsyncStorage.getItem("Projects");
  if (projectData !== null && !forceUpdate) {
    projectData = JSON.parse(projectData);
  } else {
    projectData = await fetch(globals.SERVER_URL + "/projects/", {
      cache: "no-store",
      method: "POST",
      headers: {
        Authorization: `Bearer ${AuthToken}`
      },
      body: JSON.stringify({
        userid: UserID != null ? UserID : -1
      })
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

const processProjData = (forceUpdate = false, UserID, AuthToken) => {
  return new Promise(resolve => {
    resolve(getProjectData(forceUpdate, UserID, AuthToken));
  });
};

// use hook to get the project data
const useProjects = (UserID, AuthToken) => {
  const [Projects, setProjects] = useState([]);
  useEffect(() => {
    processProjData(false, UserID, AuthToken).then(results => {
      setProjects(results);
    });
  }, []);
  return { Projects, setProjects };
};

// try to get the  point data from cache, if not get from the site.
getPointData = async (ID, userID, forceUpdate = false, AuthToken = "") => {
  const projectID = ID == -1 || typeof ID == "undefined" ? "" : ID.toString();
  let pointsData = await AsyncStorage.getItem("Points");
  if (pointsData !== null && !forceUpdate) {
    // get all the storied points and filter the ones with the correct ID
    pointsData = JSON.parse(pointsData);
    pointsData.result = pointsData.result.filter(
      points => points.projectid == ID
    );
  } else {
    AllPoints = await fetch(globals.SERVER_URL + "/locationByProject/", {
      cache: "no-store",
      method: "POST",
      headers: {
        Authorization: `Bearer ${AuthToken}`
      },
      body: JSON.stringify({
        userid: userID != null ? userID : -1
      })
    }).then(response => response.json());
    pointsData = await fetch(
      globals.SERVER_URL + "/locationByProject/" + projectID,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          Authorization: `Bearer ${AuthToken}`
        },
        body: JSON.stringify({
          userid: userID != null ? userID : -1
        })
      }
    ).then(response => response.json());
    await AsyncStorage.setItem("Points", JSON.stringify(AllPoints));
  }
  return pointsData;
};

const processPntData = (ID, userID, forceUpdate = false, AuthToken) => {
  return new Promise(resolve => {
    resolve(getPointData(ID, userID, forceUpdate, AuthToken));
  });
};

// use hook to get the data
const usePoints = (userID, AuthToken) => {
  const [Points, setPoints] = useState([]);
  useEffect(() => {
    processPntData(-1, userID, false, AuthToken).then(results => {
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
    case "updateAnswers":
      fetch(globals.SERVER_URL + "/answer/update", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${action.payload.AuthToken}`
        },
        method: "POST",
        body: JSON.stringify({
          answerid: state.items[0].answerID,
          answer: state.items[0].answer
        })
      }).then(res => {
        if (res.ok) {
          // if the update happens, then we will update the queue
          const oldStateItems = state.items;
          delete oldStateItems[0];
          return { items: [...oldStateItems] };
        }
      });
      return state;
    case "sendAnswers":
      fetch(globals.SERVER_URL + "/answer/create", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${action.payload.AuthToken}`
        },
        method: "POST",
        body: JSON.stringify({
          questionid: action.payload.questionid,
          answeredby: action.payload.userid,
          answer: action.payload.answer,
          createddate: action.payload.createddate,
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
const generateUser = async (
  name,
  email,
  password,
  affiliationid = -1,
  roleid
) => {
  const RequestResult = await fetch(
    globals.SERVER_URL.toString() + "/userAccount/create",
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
        password,
        affiliationid,
        roleid
      })
    }
  ).then(res => res.json());
  return RequestResult;
};

const processSignup = (name, email, pass, affiliationid, roleid) => {
  return new Promise(resolve => {
    resolve(generateUser(name, email, pass, affiliationid, roleid));
  });
};

const generateUserToken = async (email, password) => {
  const UserData = await fetch(
    globals.SERVER_URL.toString() + "/userAccount/validate",
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
  await SecureStore.setItemAsync("userAuth", UserData.access_token.toString());
  return UserData;
};

const processLogin = (email, password) => {
  return new Promise(resolve => {
    resolve(generateUserToken(email, password));
  });
};

const generateLocationID = async (
  longitude,
  latitude,
  projectid,
  userid,
  AuthToken = ""
) => {
  const locationID = await fetch(
    globals.SERVER_URL.toString() + "/location/create",
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthToken}`
      },
      method: "POST",
      body: JSON.stringify({
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        projectid: projectid,
        createdby: userid
      })
    }
  )
    .then(res => res.json())
    .then(response => {
      return response.locationid;
    })
    .catch(err => {
      return -1;
    });
  return locationID;
};

const processLocationID = (
  longitude,
  latitude,
  projectid,
  userid,
  AuthToken
) => {
  return new Promise(resolve => {
    resolve(
      generateLocationID(longitude, latitude, projectid, userid, AuthToken)
    );
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
  const ProjectsObj = useProjects(UserID, AuthToken);
  const Projects = ProjectsObj.Projects;
  const setProjects = ProjectsObj.setProjects;

  const [ProjectID, setProjectID] = useState(-1);
  const [ProjectName, setProjectName] = useState("");

  const PointsObj = usePoints(UserID, AuthToken);
  const Points = PointsObj.Points;
  const setPoints = PointsObj.setPoints;

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
      setAuthToken(res.asyncToken != null ? res.asyncToken : null);
    }
  });

  const [AuthToken, setAuthToken] = useState(null);

  const HandleSignup = (name, email, pass, affiliationid, roleid) => {
    processSignup(name, email, pass, affiliationid, roleid).then(results => {
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
        // when we login update project visibility
        processProjData(true, UserID, AuthToken).then(results => {
          setProjects(results);
        });
        // when we login update records visibility
        processPntData(-1, UserID, true, AuthToken).then(results => {
          setPoints(results);
        });
        setUserID(results.userid);
        setAuthToken(results.access_token);
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

  const HandleLogout = async () => {
    setUserID(null);
    setAuthToken(null);
    // when we logout update project visibility
    processProjData(true, UserID, AuthToken).then(results => {
      setProjects(results);
    });
    // when we logout update records visibility
    processPntData(-1, UserID, true, AuthToken).then(results => {
      setPoints(results);
    });
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userAuth");
  };

  const netInfo = useNetInfo();

  const processUpdaeAsync = async (answer, userid, answerID) => {
    return await dispatcher({
      type: "updateAnswers",
      payload: { answer, userid, answerID, AuthToken }
    });
  };

  const processAsync = async (
    answer,
    questionid = null,
    locationID = null,
    userid,
    createddate
  ) => {
    return await dispatcher({
      type: "sendAnswers",
      payload: {
        answer,
        questionid,
        locationID,
        userid,
        createddate,
        AuthToken
      }
    });
  };
  // TODO: Write a task to check this at intervals
  useEffect(() => {
    // if the user is logged in
    if (AuthToken != null) {
      // get the expiration date
      const { exp } = JSON.parse(decode(AuthToken.split(".")[1]));

      // if the JWT has expired
      if (Math.floor(Date.now() / 1000) > exp) {
        Toast.show({
          text:
            "Your session has expired and you have been logged out as a result.",
          buttonText: "Okay",
          type: "warning",
          position: "top",
          duration: 3000
        });
        HandleLogout();
        NavigationService.navigate("Loading");
      }
    }
  });
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
              if (OfflineStateQ.items[0].hasOwnProperty("answerID")) {
                let StateCopy = Object.assign({}, OfflineStateQ);
                Promise.all(
                  processUpdaeAsync(
                    (answer = StateCopy.items[0].answer),
                    (userid = UserID),
                    (answerID = StateCopy.items[0].answerID)
                  )
                ).then(() => {
                  dispatcher({
                    type: "pop"
                  });
                });
              } else {
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
                  (userid = UserID),
                  AuthToken
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
                          (userid = UserID),
                          StateCopy.items[0].createddate
                        )
                      )
                    ).then(() => {
                      dispatcher({
                        type: "pop"
                      });
                    });
                  }
                });
              }
            } else {
              // push to the server
              Promise.all(
                OfflineStateQ.items[0].answers.map((answer, questionid) =>
                  processAsync(
                    answer,
                    questionid,
                    OfflineStateQ.items[0].LocationID,
                    (userid = UserID),
                    OfflineStateQ.items[0].createddate
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
    [OfflineStateQ.items, netInfo.isConnected]
  );

  return (
    <ProjectProvider
      value={{
        Projects:
          typeof Projects !== "undefined"
            ? Projects.hasOwnProperty("result")
              ? Projects.result
              : []
            : [],
        Points:
          typeof Points !== "undefined"
            ? Points.hasOwnProperty("result")
              ? Points.result
              : []
            : [],
        setProjectID: ID => {
          processPntData(ID, UserID, false, AuthToken).then(results => {
            setPoints(results);
            setProjectID(ID);
            setProjectName(
              typeof Projects !== "undefined"
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
          processProjData(true, UserID, AuthToken).then(results => {
            setProjects(results);
          });
        },
        OfflineQueue: OfflineStateQ.items,
        addToOfflineQueue: locationItem => {
          dispatcher({ type: "add", payload: locationItem });
        },
        processSignup: (name, email, pass, affiliationid, roleid) =>
          HandleSignup(name, email, pass, affiliationid, roleid),
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
