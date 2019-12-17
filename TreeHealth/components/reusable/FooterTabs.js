import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Footer, FooterTab, Button, Icon } from "native-base";

export class FooterTabs extends React.Component {
  render() {
    return (
      <Footer>
        <FooterTab style={styles.footerStyle}>
          <Button onPress={this.props.switchView}>
            <Icon type="Feather" style={styles.footerIcnStyle} name={this.props.listIcon} />
          </Button>
          <Button onPress={this.props.funnelToggle}>
            <Icon type="Feather" style={styles.footerIcnStyle} name="filter" />
          </Button>
          <Button onPress={this.props.SearchToggle}>
            <Icon type="Feather" style={styles.footerIcnStyle} name="search" />
          </Button>
          <Button onPress={this.props.addItemAction}>
            <Icon type="Feather" style={styles.footerIcnStyle} name="plus" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

FooterTabs.propTypes = {
  listIcon: PropTypes.string.isRequired,
  switchView: PropTypes.func.isRequired,
  funnelToggle: PropTypes.func.isRequired,
  SearchToggle: PropTypes.func.isRequired,
  addItemAction: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  footerStyle: {
    backgroundColor: "white"
  },
  footerIcnStyle: {
    color: "black"
  }
});
