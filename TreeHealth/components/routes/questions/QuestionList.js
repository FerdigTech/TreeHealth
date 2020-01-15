import React, { useContext } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { QuestionItem } from "./QuestionItem";
import { Container, Content, Footer, FooterTab, Button } from "native-base";
import { FilterModal } from "../../reusable/FilterModal";
import { ProjectContext } from "../../../context/ProjectProvider";

export const QuestionList = props => {
  const context = useContext(ProjectContext);
  // from the filter
  const DropDownVisible = props.navigation.getParam("DropDownVisible", false);
  const Operator = props.navigation.getParam("Operator", "none");
  const FilterAffilation = props.navigation.getParam("FilterAffilation", false);
  const OnlyAffilation = props.navigation.getParam("OnlyAffilation", false);
  const EndDateFilter = props.navigation.getParam("EndDateFilter", "");
  const dateFilter = props.navigation.getParam("dateFilter", "");
  return (
    <Container>
      <Content>
        <ScrollView style={{ flex: 1 }}>
          <QuestionItem indexVal={1} isDraft={true} />
          <QuestionItem indexVal={2} isDraft={false} />
        </ScrollView>
        <FilterModal navigation={props.navigation} />
      </Content>
      {context.OfflineQueue.length > 0 && (
        <Footer>
          <FooterTab style={styles.footerStyle}>
            <Text style={styles.footerTxt}>
              You have {context.OfflineQueue.length.toString()} items in offline
              queue.
            </Text>
          </FooterTab>
          <FooterTab style={styles.footerStyle}>
            <Button onPress={() => context.forceSendQueue()}>
              <Text>Force</Text>
            </Button>
          </FooterTab>
        </Footer>
      )}
    </Container>
  );
};

QuestionList.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate("AddPoint")}>
      <Text style={styles.NavText}>Add Record</Text>
    </TouchableOpacity>
  )
});

const styles = StyleSheet.create({
  NavText: {
    color: "white",
    paddingRight: 10
  },
  footerTxt: {
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
    flex: 1
  },
  footerStyle: {
    backgroundColor: "#f4f4f4",
    borderTopColor: "#ccc",
    borderTopWidth: 1
  }
});
