import React from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { ProjectCard } from "./ProjectCard";
import { ProjectCosumer } from "../../../context/ProjectProvider";

const ProjectsEl = () => {
  return (
    <ProjectCosumer>
      {context =>
        context.Projects.map((project, index) => {
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
        })
      }
    </ProjectCosumer>
  );
};

const updateProjectData = () => {};

const wait = timeout => {
  return Promise.all([updateProjectData(), setTimeout(() => {}, timeout)]);
};

export const ProjectOverview = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(
    () => {
      setRefreshing(true);

      wait(2000).then(() => setRefreshing(false));
    },
    [refreshing]
  );

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProjectsEl forcedReset={refreshing} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ccc"
  }
});
