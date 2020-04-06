import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import UserPermissions from "../utilities/UserPermissions";

export default class PostScreen extends React.Component {
  state = {
    text: "",
    image: require("../assets/tempAvatar.png"),
    placeholder: 0,
    facebook: false,
    twitter: false,
    tumblr: false,
  };

  componentDidMount() {
    UserPermissions.getCameraRollPermission;
    this.pickImage();
  }

  handlePost = () => {
    if (this.state.image) {
      Fire.shared
        .addPost({ text: this.state.text.trim(), localUri: this.state.image })
        .then((reference) => {
          this.setState({
            text: "",
            image: require("../assets/tempAvatar.png"),
          });
          this.props.navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <SimpleLineIcons name="arrow-left" size={18}></SimpleLineIcons>
          </TouchableOpacity>
          <Text style={{ ...styles.title, marginLeft: 28 }}>New Post</Text>
          <TouchableOpacity onPress={this.handlePost}>
            <Text style={{ ...styles.title, color: "#3299F3" }}>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.captionContainer}>
            <Image
              source={{ uri: this.state.image }}
              style={{ width: 70, height: 70 }}
            ></Image>
            <TextInput
              placeholder="Write a caption..."
              placeholderTextColor="#B8BBC4"
              style={
                !this.state.placeholder
                  ? {
                      fontSize: 16,
                      fontWeight: "500",
                      marginBottom: 36,
                      marginLeft: 16,
                      width: "100%",
                    }
                  : {
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#000",
                      marginBottom: 36,
                      marginLeft: 16,
                      width: "100%",
                    }
              }
              onChangeText={(caption) =>
                this.setState({ text: caption, placeholder: caption.length })
              }
              value={this.state.text}
            ></TextInput>
          </View>

          <TouchableOpacity style={styles.tag} activeOpacity={1}>
            <Text>Tag People</Text>
            <SimpleLineIcons
              name="arrow-right"
              color="#B8BBC4"
            ></SimpleLineIcons>
          </TouchableOpacity>

          <TouchableOpacity style={styles.location} activeOpacity={1}>
            <Text>Add Location</Text>
            <SimpleLineIcons
              name="arrow-right"
              color="#B8BBC4"
            ></SimpleLineIcons>
          </TouchableOpacity>

          <View style={styles.mediaContainer}>
            <View style={styles.mediaRow}>
              <Text style={styles.media}>Facebook</Text>
              <Switch
                style={styles.switch}
                trackColor={{ true: "#B7CEE7" }}
                value={this.state.facebook}
                onChange={() =>
                  this.setState({ facebook: !this.state.facebook })
                }
              ></Switch>
            </View>

            <View style={styles.mediaRow}>
              <Text style={styles.media}>Twitter</Text>
              <Switch
                style={styles.switch}
                trackColor={{ true: "#B7CEE7" }}
                value={this.state.twitter}
                onChange={() => this.setState({ twitter: !this.state.twitter })}
              ></Switch>
            </View>

            <View style={styles.mediaRow}>
              <Text style={styles.media}>Tumblr</Text>
              <Switch
                style={styles.switch}
                trackColor={{ true: "#B7CEE7" }}
                value={this.state.tumblr}
                onChange={() => this.setState({ tumblr: !this.state.tumblr })}
              ></Switch>
            </View>
          </View>

          <TouchableOpacity style={{ height: "46.5%" }} activeOpacity={1}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 18,
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: "#B8BBC4" }}>
                Advanced Settings
              </Text>

              <SimpleLineIcons
                name="arrow-right"
                color="#B8BBC4"
              ></SimpleLineIcons>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: "#FBFBFB",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  captionContainer: {
    height: "10%",
    flexDirection: "row",
    marginHorizontal: 18,
    marginVertical: 16,
  },

  tag: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopWidth: StyleSheet.hairlineWidth * 3,
    borderTopColor: "#E0E0E0",
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    borderBottomColor: "#E0E0E0",
  },

  location: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    borderBottomColor: "#E0E0E0",
  },

  mediaContainer: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    borderBottomColor: "#E0E0E0",
  },

  media: {
    fontSize: 16,
    marginLeft: 18,
    marginVertical: 16,
  },

  mediaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switch: {
    marginRight: 18,
  },
});
