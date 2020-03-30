import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";

export default class EditProfileScreen extends React.Component {
  state = {
    user: {}
  };

  unsubscribe = null;

  componentDidMount() {
    const user = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleEditProfile = async () => {
    const uri = await Fire.shared.uploadPhotoAsync(
      this.state.user.avatar,
      `photos/${Fire.shared.uid}/avatar`
    );
    this.setState({ user: { ...this.state.user, avatar: uri } });
    Fire.shared.updateProfile(this.state.user);
    this.props.navigation.goBack();
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4]
    });

    if (!result.cancelled) {
      this.setState({ user: { ...this.state.user, avatar: result.uri } });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginLeft: 14 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={{ fontSize: 18 }}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <TouchableOpacity
            style={{ marginRight: 14 }}
            onPress={this.handleEditProfile}
          >
            <Text style={{ fontSize: 18, color: "#3299F3", fontWeight: "600" }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={
              this.state.user.avatar
                ? { uri: this.state.user.avatar }
                : require("../assets/tempAvatar.png")
            }
            style={styles.avatar}
          ></Image>

          <TouchableOpacity onPress={this.pickImage}>
            <Text
              style={{ marginTop: 18, fontWeight: "500", color: "#3299F3" }}
            >
              Change Profile Photo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <View style={styles.input}>
            <Text style={styles.text}>Name</Text>
            <Text style={styles.text}>Username</Text>
            <Text style={styles.text}>Website</Text>
            <Text style={styles.text}>Bio</Text>
          </View>

          <View style={{ ...styles.input, width: "100%" }}>
            <TextInput
              placeholder={this.state.user.name ? this.state.user.name : "Name"}
              style={styles.inputText}
              onChangeText={name =>
                this.setState({ user: { ...this.state.user, name } })
              }
              value={this.state.user.name}
            ></TextInput>
            <TextInput
              placeholder={
                this.state.user.username ? this.state.user.username : "Username"
              }
              style={styles.inputText}
              onChangeText={username =>
                this.setState({ user: { ...this.state.user, username } })
              }
              value={this.state.user.username}
            ></TextInput>
            <TextInput
              placeholder={
                this.state.user.website ? this.state.user.website : "Website"
              }
              style={styles.inputText}
              onChangeText={website =>
                this.setState({ user: { ...this.state.user, website } })
              }
              value={this.state.user.website}
            ></TextInput>
            <TextInput
              placeholder={this.state.user.bio ? this.state.user.bio : "Bio"}
              style={{ ...styles.inputText, borderBottomWidth: 0 }}
              onChangeText={bio =>
                this.setState({ user: { ...this.state.user, bio } })
              }
              value={this.state.user.bio}
            ></TextInput>
          </View>
        </View>

        <TouchableOpacity
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth * 2,
            borderBottomColor: "#E0E0E0"
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#3299F3",
              marginVertical: 14,
              marginLeft: 16
            }}
          >
            Switch to Professional Account
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            ...styles.input,
            fontSize: 16,
            fontWeight: "600",
            marginVertical: 16
          }}
        >
          Private Information
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.input}>
            <Text style={styles.text}>Email</Text>
            <Text style={styles.text}>Phone</Text>
            <Text style={styles.text}>Gender</Text>
          </View>

          <View style={{ ...styles.input, width: "100%" }}>
            <TextInput
              placeholder={
                this.state.user.email ? this.state.user.email : "Email"
              }
              style={styles.inputText}
              onChangeText={email =>
                this.setState({ user: { ...this.state.user, email } })
              }
              value={this.state.user.email}
            ></TextInput>
            <TextInput
              placeholder={
                this.state.user.phone ? this.state.user.phone : "Phone"
              }
              style={styles.inputText}
              onChangeText={phone =>
                this.setState({ user: { ...this.state.user, phone } })
              }
              value={this.state.user.phone}
            ></TextInput>
            <TextInput
              placeholder="Gender"
              style={styles.inputText}
            ></TextInput>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  header: {
    paddingTop: 54,
    backgroundColor: "#FBFBFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 12
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginRight: 8
  },

  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50
  },

  info: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: "#E0E0E0",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0"
  },

  input: {
    marginHorizontal: 14
  },

  text: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 14
  },

  inputText: {
    fontSize: 16,
    marginTop: 14,
    width: "64.5%",
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0"
  }
});
