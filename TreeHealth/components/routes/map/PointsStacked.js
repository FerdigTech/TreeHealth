import React, { useState } from "react";
import { ScrollView, Image, StyleSheet, View, TextInput } from "react-native";
import {
  Container,
  Content,
  Text,
  ListItem,
  Left,
  Body,
  Right
} from "native-base";
import { FooterTabs } from "../../reusable/FooterTabs";
import { TitleDrop, ProjectsModalDrop } from "./../../reusable/TitleDrop";
import NavigationService from "../../../services/NavigationService";
import { ProjectCosumer } from "../../../context/ProjectProvider";

export const PointsStacked = props => {
  const [currentProject] = useState(
    props.navigation.getParam("projectName", "All")
  );
  const [showSearch, setShowSearch] = useState(false);
  const [Points, setPoints] = useState([]);
  let [RenderedPts, setRenderedPts] = useState(null);
  const img = require("../../../assets/treehouse-default.png");

  const searchAndFilter = text => {
    const filteredPts = Points.filter(point =>
      point.properties.title.toLowerCase().includes(text.toLowerCase())
    );
    setRenderedPts(filteredPts);
  };

  return (
    <Container>
      <Content>
        <ProjectsModalDrop navigation={props.navigation} />
        {showSearch && (
          <View style={styles.SearchView}>
            <TextInput
              style={styles.SearchBox}
              placeholder={"Search"}
              onEndEditing={e => searchAndFilter(e.nativeEvent.text)}
            />
          </View>
        )}
        <ProjectCosumer>
          {context => {
            setPoints(context.Points);
          }}
        </ProjectCosumer>
        <ScrollView style={{ flex: 1 }}>
          {
            // inialize the points to contain everything otherwise render just the filtered
            ((RenderedPts = RenderedPts == null ? Points : RenderedPts),
            RenderedPts.map((point, index) => {
              return (
                <ListItem key={index}>
                  <Left>
                    <Image source={img} style={styles.headerImg} />
                  </Left>
                  <Body>
                    <Text
                      llipsizeMode="tail"
                      numberOfLines={1}
                      style={styles.titleTxt}
                    >
                      {point.properties.title}
                    </Text>
                  </Body>
                  <Right />
                </ListItem>
              );
            }))
          }
        </ScrollView>
      </Content>
      <FooterTabs
        listIcon="compass"
        switchView={() => NavigationService.navigate("Map")}
        funnelToggle={() => {}}
        SearchToggle={() => {
          setShowSearch(!showSearch);
        }}
        addItemAction={() =>
          NavigationService.navigate("QuestionList", {
            projectName: currentProject
          })
        }
      />
    </Container>
  );
};

PointsStacked.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <TitleDrop
      navigation={navigation}
      projectName={navigation.getParam("projectName", "All")}
    />
  )
});

const styles = StyleSheet.create({
  headerImg: {
    height: 40,
    width: 40,
    flex: 1
  },
  SearchView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: "40%",
    marginLeft: "30%",
    marginRight: "30%",
    marginTop: 10
  },
  SearchBox: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "90%",
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10
  },
  titleTxt: {
    fontWeight: "bold",
    fontSize: 16
  }
});
