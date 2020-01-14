import React, { useEffect, useState, useReducer } from "react";
import ProjectContext from "./ProjectProvider";
import { AsyncStorage } from "react-native";
import globals from "../globals";
import { useNetInfo } from "@react-native-community/netinfo";

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
    projectData = await fetch(globals.SERVER_URL + "/projects/").then(
      response => response.json()
    );
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
    AllPoints = await fetch(globals.SERVER_URL + "/points/").then(response =>
      response.json()
    );
    pointsData = await fetch(globals.SERVER_URL + "/points/" + projectID).then(
      response => response.json()
    );
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
      return { items: [...state.items, action.payload] };
    case "pop":
      return { items: state.items.filter((_, i) => i !== 0) };
    case "set":
      return action.payload;
    default:
      throw new Error();
  }
};

const sendtoServerAnswers = async (answers, locationID) => {
  let sucessCount = 0;
  answers.map((answer, questionid) => {
    // post to URL /answer/create
    // passing questionid: questionID, answeredby:userID, answer: answer[questionID], locationid
    fetch(globals.SERVER_URL + "/answer/create", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        questionid,
        answeredby: 10,
        answer,
        locationID
      })
    }).then(function(res) {
      // if a 200s response
      if (res.ok) {
        sucessCount += 1;
      }
      // count the sucessful sends, if all of them then we can remove this item
      if (sucessCount == answers.length) {
        dispatcher({ type: "pop" });
        // TODO: refresh the cache for the records
        // this is so it shows up in manage view
      }
    });
  });
};

const generateLocationID = async (longitude, latitude, projectid) => {
  const locationID = await fetch(globals.SERVER_URL + "/location/create", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      longitude: longitude,
      latitude: latitude,
      projectid: projectid,
      createdby: 10,
      title: "hi"
    })
  })
    .then(response => response.json())
    .then(response => response.projectid)
    .catch(() => {
      return -1;
    });
  return locationID;
};

const processLocationID = (longitude, latitude, projectid) => {
  return new Promise(resolve => {
    resolve(generateLocationID(longitude, latitude, projectid));
  });
};

// Build the provider
export const ProjectWrapper = ({ children }) => {
  const ProjectsObj = useProjects();
  const Projects = ProjectsObj.Projects;
  const setProjects = ProjectsObj.setProjects;

  const [ProjectID, setProjectID] = useState(-1);

  const PointsObj = usePoints();
  const Points = PointsObj.Points;
  const setPoints = PointsObj.setPoints;

  const [OfflineStateQ, dispatcher] = useReducer(
    OfflineReducer,
    { items: [] },
    () => {
      return { items: [] };
    }
  );

  const netInfo = useNetInfo();

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
                (projectid = ProjectID)
              ).then(locationID => {
                // on sucesss copy state
                let StateCopy = Object.assign({}, OfflineStateQ);
                // create property LocationID and set it
                StateCopy.items[0].LocationID = locationID;
                // update our global state
                dispatcher({ type: "set", payload: StateCopy });
                // push to the server
                sendtoServerAnswers(StateCopy.items[0].answers, locationID);
              });
            } else {
              // push to the server
              sendtoServerAnswers(
                OfflineStateQ.items[0].answers,
                StateCopy.items[0].LocationID
              );
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
        Projects: Projects !== "undefined" ? Projects : [],
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
          });
        },
        ProjectID,
        updateProjects: () => {
          processProjData(true).then(results => {
            setProjects(results);
          });
        },
        OfflineQueue: OfflineStateQ.items,
        addToOfflineQueue: locationItem => {
          dispatcher({ type: "add", payload: locationItem });
        }
      }}
    >
      {children}
    </ProjectProvider>
  );
};
