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

// use hook to get the data
function usePoints() {
  const [Points, setPoints] = useState([]);
  useEffect(() => {
    async function getData() {
      const PointsData = await fetch(globals.SERVER_URL + "/points/").then(
        response => response.json()
      )
      setPoints(PointsData);
    }
    getData();
  }, []);
  return Points;
}

// Build the provider
export function ProjectWrapper({ children }) {
  const Projects = useProjects();
  const Points = usePoints();
  return (
    <ProjectProvider
      value={{
        Projects: Projects !== "undefined" ? Projects : [],
        Points:
          Points !== "undefined"
            ? Points.hasOwnProperty("features")
              ? Points.features
              : []
            : []
      }}
    >
      {children}
    </ProjectProvider>
  );
}
