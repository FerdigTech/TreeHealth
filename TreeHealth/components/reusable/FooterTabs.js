import React from "react";
import { StyleSheet } from "react-native";
import { Footer, FooterTab, Button, Icon } from "native-base";

export class FooterTabs extends React.Component {
  render() {
    return (
      <Footer>
        <FooterTab style={styles.footerStyle}>
          <Button onPress={this.props.switchView}>
            <Icon style={styles.footerIcnStyle} name={this.props.listIcon} />
          </Button>
          <Button onPress={this.props.funnelToggle}>
            <Icon style={styles.footerIcnStyle} name="funnel" />
          </Button>
          <Button onPress={this.props.SearchToggle}>
            <Icon style={styles.footerIcnStyle} name="search" />
          </Button>
          <Button onPress={this.props.addItemAction}>
            <Icon style={styles.footerIcnStyle} name="add" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const styles = StyleSheet.create({
  footerStyle: {
    backgroundColor: "white"
  },
  footerIcnStyle: {
    color: "black"
  }
});
