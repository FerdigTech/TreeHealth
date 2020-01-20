import React from "react";

import { Text, ScrollView, SafeAreaView, StyleSheet, View } from "react-native";
import { Container, Content, Card, CardItem, Body } from "native-base";
import Constants from "expo-constants";

export const AboutUsScreen = () => {
  return (
    <SafeAreaView style={styles.SafeView}>
      <ScrollView>
        <Container>
          <Content padder>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>About us</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>
                    Tree Health Survey is a smartphone app for collaborative
                    citizen science projects focused on plant diseases. This app
                    is a spinoff of ParkApps NE Ohio, a collaborative project
                    between Kent State University, the Cuyahoga Valley National
                    Park, and the Cleveland Metroparks and is funded by a grant
                    from the National Science Foundation (#1422764.) Tree Health
                    Survey users will join a community of citizen scientists,
                    natural resource managers, park employees, and more to track
                    Beech Leaf Disease, tree die-off, and more. Each citizen
                    science project will have its own training section, allowing
                    users to learn background information and any identification
                    skills they will need before participating in data
                    collection.
                  </Text>
                </Body>
              </View>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>Feedback</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>
                    Have a suggestion for a citizen science project we can add
                    to this app? Feel free to contact us at
                    appsforparks@gmail.com.
                  </Text>
                </Body>
              </View>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text style={styles.HeaderTxt}>App Version</Text>
              </CardItem>
              <View style={styles.CardBody}>
                <Body>
                  <Text>{Constants.manifest.version}</Text>
                </Body>
              </View>
            </Card>
          </Content>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeView: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10
  },
  HeaderTxt: {
    fontWeight: "bold"
  },
  CardBody: {
    padding: 10
  }
});