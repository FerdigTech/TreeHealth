import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  Modal,
  Image,
  Button
} from "react-native";

export class MarkerModal extends React.Component {
  render() {
    return (
      <Modal style={styles.markerModal} visible={this.props.show}>
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        >
          <Button
            style={styles.modalButton}
            onPress={this.props.handleClose}
            title={"Close"}
          />
          <Image
            style={styles.modalImg}
            source={require("./../../../assets/treehouse-default.png")}
          />
          <Text style={styles.modalText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalButton: {
    width: "100%",
    zIndex: 2
  },
  modalText: {
    fontSize: 20,
    margin: "5%",
    marginTop: 0
  },
  modalImg: {
    width: "90%",
    margin: "5%",
    marginTop: 15,
    paddingTop: 15,
    flex: 1
  },
  markerModal: {
    zIndex: 1
  }
});
