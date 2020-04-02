import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import {
  SimpleLineIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";

export default class MessageUserScreen extends React.Component {
  state = {
    user: this.props.navigation.state.params.user,
    messages: [],
    currentMessage: ""
  };

  userMessages = async recipientUID => {
    const messages = await Fire.shared.getMessages(recipientUID);
    this.setState({ messages, currentMessage: "" });
  };

  componentDidMount() {
    this.userMessages(this.state.user.uid);
  }

  sendMessage = async () => {
    const message = this.state.currentMessage;
    this.setState({ currentMessage: "" });
    await Fire.shared.sendMessage(this.state.user.uid, message);

    await this.userMessages(this.state.user.uid);
  };

  renderButtons = () => {
    if (!this.state.currentMessage.length) {
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity activeOpacity={1} style={styles.icon}>
            <SimpleLineIcons name="microphone" size={28}></SimpleLineIcons>
          </TouchableOpacity>

          <TouchableOpacity style={styles.icon}>
            <MaterialCommunityIcons
              name="image-outline"
              size={28}
            ></MaterialCommunityIcons>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.icon, marginRight: 12 }}>
            <MaterialCommunityIcons
              name="sticker-emoji"
              size={28}
            ></MaterialCommunityIcons>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <Button
            type="clear"
            title="Send"
            titleStyle={{ fontWeight: "500", color: "#3299F3" }}
            buttonStyle={{ paddingHorizontal: 16 }}
            onPress={() => this.sendMessage()}
          ></Button>
        </View>
      );
    }
  };

  renderMessage = message => {
    if (message.thisUser) {
      return (
        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.thisUser}>
            <Text>{message.message}</Text>
            <Text style={{ fontSize: 11, color: "#4C4C4C", marginTop: 2 }}>
              {moment(message.timestamp).fromNow()}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <Avatar
            containerStyle={{ marginHorizontal: 16, marginTop: 24 }}
            source={{ uri: this.state.user.avatar }}
            rounded
          ></Avatar>

          <View style={styles.otherUser}>
            <Text>{message.message}</Text>
            <Text style={{ fontSize: 11, color: "#4C4C4C", marginTop: 2 }}>
              {moment(message.timestamp).fromNow()}
            </Text>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ paddingHorizontal: 18, paddingVertical: 8 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <SimpleLineIcons name="arrow-left" size={18}></SimpleLineIcons>
            </TouchableOpacity>

            <Avatar source={{ uri: this.state.user.avatar }} rounded></Avatar>

            <Text style={styles.headerTitle}>{this.state.user.username}</Text>
          </View>

          <TouchableOpacity>
            <AntDesign
              name="videocamera"
              size={24}
              style={{ paddingVertical: 12, paddingHorizontal: 18 }}
            ></AntDesign>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%", backgroundColor: "#FFF" }}
          behavior="padding"
        >
          <FlatList
            inverted={true}
            data={this.state.messages}
            renderItem={({ item }) => this.renderMessage(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
          />

          <View style={styles.footerContainer}>
            <View style={styles.footer}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                    marginLeft: 6,
                    marginRight: 12,
                    backgroundColor: "#3299F3",
                    borderRadius: 20
                  }}
                >
                  <SimpleLineIcons
                    name="camera"
                    size={26}
                    color="#FFF"
                  ></SimpleLineIcons>
                </TouchableOpacity>

                <TextInput
                  placeholder="Message..."
                  placeholderTextColor="#999999"
                  style={{
                    width: Dimensions.get("window").width * 0.45
                  }}
                  onChangeText={message =>
                    this.setState({ currentMessage: message })
                  }
                  value={this.state.currentMessage}
                ></TextInput>
              </View>

              {this.renderButtons()}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },

  header: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 48,
    backgroundColor: "#FBFBFB",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0"
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 12
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFEFEF",
    borderRadius: 28,
    height: 44,
    marginHorizontal: 8
  },

  footerContainer: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 42,
    marginTop: 10,
    backgroundColor: "#FFF"
  },

  icon: {
    paddingHorizontal: 6
  },

  thisUser: {
    alignItems: "flex-end",
    backgroundColor: "#EFEFEF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    marginHorizontal: 16,
    borderRadius: 50
  },

  otherUser: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 50
  }
});
