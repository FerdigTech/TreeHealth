import React, { useEffect, useState } from "react";
import { ProjectContext } from "./ProjectProvider";
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

// hit the backend to
async function getData(ID) {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  return await fetch(globals.SERVER_URL + "/points/" + projectID).then(
    response => response.json()
  );
}

const processData = ID => {
  return new Promise(resolve => {
    resolve(getData(ID));
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
        setProjectID(ID) {
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
