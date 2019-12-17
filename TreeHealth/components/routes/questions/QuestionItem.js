import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Button, ListItem, Text, Icon, Left, Body, Right } from "native-base";
 

export class QuestionItem extends React.Component {
  render() {
    return (
      <ListItem style={styles.listItemStyle}>
        <Left style={styles.leftHandInfo}>
            <Text style={styles.itemDate}>October 14, 2019</Text>
            <Text style={styles.itemDraft}>{this.props.isDraft ? 'Draft' : ' '}</Text>
            <Text style={styles.itemUpdated} note>last updated August 3, 2019</Text>
        </Left>
        <Body/>
        <Right>
          <Button style={styles.lstIconBtn} warning={this.props.isDraft} success={!this.props.isDraft}>
            <Icon style={styles.listIcon} name={ this.props.isDraft ? 'create' : 'checkmark'} />
          </Button>
        </Right>
      </ListItem>
    );
  }
}

QuestionItem.propTypes = {
  isDraft: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  lstIconBtn: {
    alignSelf: 'flex-end',
    height: 24,
    width: 24,
    borderRadius: 24,
    justifyContent: "center"
  },
  listIcon: {
    marginLeft: 0,
    marginRight: 0, 
    fontSize: 18 
  },
  itemUpdated: {
    alignSelf: 'flex-start',
  },
  itemDraft: {
    alignSelf: 'flex-start',
  },
  itemDate: {
    fontWeight: "bold",
    alignSelf: 'flex-start',
  },
  listItemStyle: {
  },
  leftHandInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignContent: "flex-start",
    textAlign: "left"
  }
});
