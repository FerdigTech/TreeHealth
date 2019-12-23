import React, { useEffect, useState } from "react";
import { ProjectContext } from "./ProjectProvider";
import globals from "./globals";

const ProjectProvider = ProjectContext.Provider;

// use hook to get the data
function useProjects() {
  const [Projects, setProjects] = useState([]);
  useEffect(() => {
    async function getData() {
      const data = await fetch(globals.SERVER_URL + "/projects/").then(
        response => response.json()
      );
      setProjects(data);
    }
    getData();
  }, []);
  return Projects;
}

// Build the provider
export function ProjectWrapper({ children }) {
  const Projects = useProjects();
  return (
    <ProjectProvider
      value={{
        Projects: Projects !== "undefined" ? Projects : []
      }}
    >
      {children}
    </ProjectProvider>
  );
}
