import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { QuestionItem } from "./QuestionItem";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Fab
} from "native-base";
import { FilterModal } from "../../reusable/FilterModal";
import { ProjectContext } from "../../../context/ProjectProvider";
import Moment from "moment";


export const QuestionList = props => {
  const [Points, setPoints] = useState([]);
  const context = useContext(ProjectContext);
  // from the filter
  const DropDownVisible = props.navigation.getParam("DropDownVisible", false);
  const Operator = props.navigation.getParam("Operator", "none");
  const FilterAffilation = props.navigation.getParam("FilterAffilation", false);
  const OnlyAffilation = props.navigation.getParam("OnlyAffilation", false);
  const EndDateFilter = props.navigation.getParam("EndDateFilter", "");
  const dateFilter = props.navigation.getParam("dateFilter", "");

  toggleDropVis = () => {
    const DropDownVisible = props.navigation.getParam("DropDownVisible");

    props.navigation.setParams({
      DropDownVisible: !DropDownVisible
    });
  };

  useEffect(() => {
    setPoints(context.Points);
  }, []);
  return (
    <Container>
      <Content>
        <ScrollView style={{ flex: 1 }}>
          {Points.filter(
            point => !FilterAffilation || !point.hasOwnProperty("affiliationid")
          )
            .filter(
              point => !OnlyAffilation || point.hasOwnProperty("affiliationid")
            )
            .filter(
              point =>
                Operator != "before" ||
                Moment(Moment.unix(point.createddate)).isSameOrBefore(
                  Moment(dateFilter)
                )
            )
            .filter(
              point =>
                Operator != "after" ||
                Moment(Moment.unix(point.createddate)).isSameOrAfter(
                  Moment(dateFilter)
                )
            )
            .filter(
              point =>
                Operator != "dayof" ||
                Moment(Moment.unix(point.createddate)).isSame(
                  Moment(dateFilter),
                  "day"
                )
            )
            .filter(
              point =>
                Operator != "range" ||
                (Moment(Moment.unix(point.createddate)).isSameOrAfter(
                  Moment(dateFilter)
                ) &&
                  Moment(Moment.unix(point.createddate)).isSameOrBefore(
                    Moment(EndDateFilter)
                  ))
            )
            .map((point, index) => {
              return (
                <QuestionItem
                  key={index}
                  indexVal={index}
                  pointData={point}
                  isDraft={false}
                />
              );
            })}
        </ScrollView>
        <FilterModal navigation={props.navigation} />
      </Content>
      <Fab
        active={false}
        direction="up"
        style={styles.filterIcon}
        position="bottomRight"
        onPress={() => toggleDropVis()}
      >
        <Icon type="Feather" name="filter" />
      </Fab>
      {context.OfflineQueue.length > 0 && (
        <Footer>
          <FooterTab style={styles.footerStyle}>
            <Text style={styles.footerTxt}>
              You have {context.OfflineQueue.length.toString()} item{context
                .OfflineQueue.length > 1
                ? "s"
                : ""}{" "}
              in offline queue.
            </Text>
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
    borderTopWidth: 1,
    zIndex: 2
  },
  filterIcon: {
    backgroundColor: "#d9534f",
    zIndex: 5
  }
});
