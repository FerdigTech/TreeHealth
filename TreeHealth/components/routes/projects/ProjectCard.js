import React from "react";
import { StyleSheet, Image } from "react-native";
import { Text, Left, Body, Card, CardItem, Content } from "native-base";

export class ProjectCard extends React.Component {
  render() {
    return (
    <Content>
      <Card>
        <CardItem cardBody>
          <Image
            source={require("../../../assets/treehouse-default.png")}
            style={{ height: 200, width: null, flex: 1 }}
          />
        </CardItem>
        <CardItem>
          <Left>
            <Body>
              <Text>Beech Leaf Disease Training</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Body>
              <Text note>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </Body>
          </Left>
        </CardItem>
      </Card>
      </Content>
    );
  }
}

const styles = StyleSheet.create({});
