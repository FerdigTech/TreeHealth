import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Button, ListItem, Text, Icon, Left, Body, Right } from "native-base";

export class HomeList extends React.Component {
  render() {
    return (
      <ListItem onPress={this.props.menuAction}>
        <Left>
          <Button style={styles.iconStyling}>
            <Icon name={this.props.iconName} />
          </Button>
        </Left>
        <Body>
          <Text>{this.props.menuName}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}

HomeList.propTypes = {
  menuAction: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  menuName: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  iconStyling: {
    backgroundColor: "#00b374",
    color: "white"
  }
});
