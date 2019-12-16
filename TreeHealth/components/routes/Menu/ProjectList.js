import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ProjectItem } from "./ProjectItem";

export class ProjectList extends React.Component {
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <ProjectItem isDraft={true}/>
        <ProjectItem isDraft={false}/>
      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
});