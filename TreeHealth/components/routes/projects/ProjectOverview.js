import React from "react";
import { ScrollView } from "react-native";
import { ProjectCard } from "./ProjectCard";
import { Container, Content } from "native-base";
import { ProjectCosumer } from "./../../../ProjectProvider";

function ProjectsEl() {
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
}

export class ProjectOverview extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <ScrollView style={{ flex: 1 }}>
            <ProjectsEl />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
