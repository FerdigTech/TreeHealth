import React from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { ProjectCard } from './ProjectCard';
import { ProjectConsumer } from '../../../context/ProjectProvider';

export const ProjectOverview = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  // On the refresh we should update the projects
  const onRefresh = React.useCallback(
    (context) => {
      setRefreshing(true);
      context.updateProjects();
      setRefreshing(false);
    },
    [refreshing]
  );

  return (
    <SafeAreaView>
      <ProjectConsumer>
        {(context) => {
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
                      context.setProjectID(project.projectid);
                    }}
                    key={index}
                  />
                );
              })}
            </ScrollView>
          );
        }}
      </ProjectConsumer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#ccc',
  },
});
