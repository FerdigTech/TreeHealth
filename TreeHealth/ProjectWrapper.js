import React, { useEffect, useState } from "react";
import { ProjectContext } from "./ProjectProvider";
import { AsyncStorage } from "react-native";
import globals from "./globals";

const ProjectProvider = ProjectContext.Provider;

// use hook to get the data
function useProjects() {
  const [Projects, setProjects] = useState([]);
  useEffect(() => {
    async function getData() {
      const ProjectData = await fetch(globals.SERVER_URL + "/projects/").then(
        response => response.json()
      );
      setProjects(ProjectData);
    }
    getData();
  }, []);
  return Projects;
}

// try to get the  point data from cache, if not get from the site.
getPointData = async ID => {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  let pointsData = await AsyncStorage.getItem("Points");
  if (pointsData !== null) {
    // get all the storied points and filter the ones with the correct ID
    pointsData = JSON.parse(pointsData);
    pointsData.features = pointsData.features.filter(points => points.properties.projectID == ID);
  } else {
    AllPoints = await fetch(globals.SERVER_URL + "/points/").then(
      response => response.json()
    );
    pointsData = await fetch(globals.SERVER_URL + "/points/" + projectID).then(
      response => response.json()
    );
    await AsyncStorage.setItem("Points", JSON.stringify(AllPoints));
  }
  return pointsData;
};

const processData = ID => {
  return new Promise(resolve => {
    resolve(getPointData(ID));
  });
};

// use hook to get the data
function usePoints() {
  const [Points, setPoints] = useState([]);
  useEffect(() => {
    processData(-1).then(results => {
      setPoints(results);
    });
  }, []);
  return { Points, setPoints };
}

// Build the provider
export function ProjectWrapper({ children }) {
  const Projects = useProjects();
  const PointsObj = usePoints();
  const Points = PointsObj.Points;
  const setPoints = PointsObj.setPoints;
  return (
    <ProjectProvider
      value={{
        Projects: Projects !== "undefined" ? Projects : [],
        Points:
          Points !== "undefined"
            ? Points.hasOwnProperty("features")
              ? Points.features
              : []
            : [],
        setProjectID: ID => {
          processData(ID).then(results => {
            setPoints(results);
          });
        }
      }}
    >
      {children}
    </ProjectProvider>
  );
}
