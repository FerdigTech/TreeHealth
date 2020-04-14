import React from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { ProjectCard } from "./ProjectCard";
import { ProjectCosumer } from "../../../context/ProjectProvider";

export const ProjectOverview = () => {
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
    <SafeAreaView>
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
              {context.Projects.filter(project => project.isactive).map((project, index) => {
                return (
                  <ProjectCard
                    projectName={project.name}
                    defaultImg={true}
                    projectSummary={project.description}
                    setProjectID={() => {
                      context.setProjectID(project.projectid);
                    }}
                    key={index}
                  />
                );
              })}
            </ScrollView>
          );
        }}
      </ProjectCosumer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#ccc"
  }
});
