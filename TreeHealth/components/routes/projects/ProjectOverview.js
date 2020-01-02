import React from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { ProjectCard } from "./ProjectCard";
import {
  ProjectCosumer
} from "../../../context/ProjectProvider";

const ProjectsEl = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  // On the refresh we should update the projects
  const onRefresh = React.useCallback(
    context => {
      setRefreshing(true);
      context.updateProjects();
      setRefreshing(false);
    },
    [refreshing]
  );

  return (
    <ProjectCosumer>
      {context => {
        return (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh(context)}
              />
            }
          >
            {context.Projects.map((project, index) => {
              return (
                <ProjectCard
                  projectName={project.name}
                  defaultImg={true}
                  projectSummary={project.description}
                  setProjectID={() => {
                    context.setProjectID(project.ProjectID);
                  }}
                  key={index}
                />
              );
            })}
          </ScrollView>
        );
      }}
    </ProjectCosumer>
  );
};

export const ProjectOverview = () => {
  return (
    <SafeAreaView>
      <ProjectsEl />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ccc"
  }
});
