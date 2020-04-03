import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Image as RNImg
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
  Entypo,
  AntDesign
} from "@expo/vector-icons";
import { Image } from "react-native-elements";
import Fire from "../Fire";

export default class ProfileScreen extends React.Component {
  state = {
    user: {},
    posts: [],
    followers: [],
    following: [],
    viewPostsIsFocused: true,
    modalVisible: false,
    isRendered: false,
    isRefreshing: false
  };

  getPosts = async () => {
    try {
      const user = this.props.uid || Fire.shared.uid;
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(user)
        .collection("posts")
        .get();

      const userData = await Fire.shared.getUser(user);

      this.setState({
        user: userData,
        posts: snapshot.docs
          .map(doc => {
            return { ...doc.data(), postId: doc.id, avatar: userData.avatar };
          })
          .sort((a, b) => b.timestamp - a.timestamp)
      });
    } catch (error) {
      console.log(error);
    }
  };

  getFollowers = async () => {
    try {
      const user = this.props.uid || Fire.shared.uid;
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(user)
        .collection("followers")
        .get();

      this.setState({ followers: snapshot.docs.map(doc => doc.data()) });
    } catch (error) {
      console.log(error);
    }
  };

  getFollowing = async () => {
    try {
      const user = this.props.uid || Fire.shared.uid;
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(user)
        .collection("following")
        .get();

      this.setState({
        following: snapshot.docs.map(doc => doc.data())
      });
    } catch (error) {
      console.log(error);
    }
  };

  getInfo = async () => {
    const posts = this.getPosts();
    const followers = this.getFollowers();
    const following = this.getFollowing();

    await Promise.all([posts, followers, following]);
    this.setState({ isRendered: true, isRefreshing: false });
  };

  componentDidMount() {
    const user = this.props.uid || Fire.shared.uid;

    this.getInfo();
  }

  renderPost = post => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          this.props.navigation.navigate("personalPosts", {
            posts: this.state.posts,
            username: this.state.user.username,
            avatar: this.state.user.avatar
          })
        }
      >
        <Image
          source={{ uri: post.image }}
          style={{
            width: Dimensions.get("window").width * 0.333,
            height: Dimensions.get("window").width * 0.333,
            margin: StyleSheet.hairlineWidth * 2
          }}
        ></Image>
      </TouchableOpacity>
    );
  };

  handleViewPosts = () => {
    if (this.state.viewPostsIsFocused) {
      if (!this.state.posts.length) {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 32,
              backgroundColor: "#FFF"
            }}
          >
            <Image
              source={require("../assets/circle-plus.jpg")}
              containerStyle={{ height: 90, width: 90, marginTop: 64 }}
            ></Image>
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "300",
                marginTop: 20
              }}
            >
              Share Photos and Videos
            </Text>
            <Text style={{ textAlign: "center", marginVertical: 20 }}>
              When you share photos and videos, they'll appear on your profile.
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("postModal")}
            >
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: "#3299F3",
                  fontWeight: "600"
                }}
              >
                Share your first photo or video
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.posts}
              renderItem={({ item }) => this.renderPost(item)}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={true}
              numColumns={3}
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.setState({ isRefreshing: true });
                this.getInfo();
              }}
            />
          </View>
        );
      }
    }
  };

  render() {
    if (this.state.isRendered) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={{ alignSelf: "center", position: "absolute", top: 56 }}
            onPress={() => {
              this.setState({ modalVisible: true });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="lock" size={14} style={{ marginRight: 4 }}></Entypo>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {this.state.user.username}
              </Text>
              <Ionicons
                name="ios-arrow-down"
                size={16}
                style={{ marginLeft: 4 }}
              ></Ionicons>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: 0, top: 36, padding: 18 }}
            onPress={() => this.props.navigation.navigate("openMenuModal")}
          >
            <SimpleLineIcons name="menu" size={22}></SimpleLineIcons>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              marginTop: 96,
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity style={styles.avatarContainer}>
              <RNImg
                source={
                  this.state.user.avatar
                    ? { uri: this.state.user.avatar }
                    : require("../assets/tempAvatar.png")
                }
                style={{ width: 90, height: 90, borderRadius: 50 }}
              ></RNImg>
              <Ionicons
                name="ios-add-circle"
                size={32}
                color={"#3299F3"}
                style={{ position: "absolute", right: -8, bottom: -8 }}
              ></Ionicons>
            </TouchableOpacity>

            <View style={{ flexDirection: "row" }}>
              <View style={{ ...styles.attribute, marginRight: 30 }}>
                <Text
                  style={
                    this.state.posts.length
                      ? styles.attributeText
                      : { ...styles.attributeText, color: "#93959C" }
                  }
                >
                  {this.state.posts.length}
                </Text>
                <Text>Posts</Text>
              </View>

              <TouchableOpacity style={styles.attribute}>
                <Text
                  style={
                    this.state.followers.length
                      ? styles.attributeText
                      : { ...styles.attributeText, color: "#93959C" }
                  }
                >
                  {this.state.followers.length}
                </Text>
                <Text>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.attribute}>
                <Text
                  style={
                    this.state.following.length
                      ? styles.attributeText
                      : { ...styles.attributeText, color: "#93959C" }
                  }
                >
                  {this.state.following.length}
                </Text>
                <Text>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={{ fontWeight: "500", marginHorizontal: 18, marginTop: 12 }}
          >
            {this.state.user.name}
          </Text>

          <Text style={{ marginHorizontal: 18, marginBottom: 16 }}>
            {this.state.user.bio}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("editProfileModal")}
          >
            <Text style={{ textAlign: "center", fontWeight: "600" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: 8,
              marginBottom: StyleSheet.hairlineWidth * 2
            }}
          >
            <TouchableOpacity
              style={
                this.state.viewPostsIsFocused
                  ? styles.defaultPosts
                  : {
                      ...styles.defaultPosts,
                      borderBottomWidth: StyleSheet.hairlineWidth * 2,
                      borderBottomColor: "#E0E0E0"
                    }
              }
              onPress={() => this.setState({ viewPostsIsFocused: true })}
            >
              <Ionicons
                name="md-grid"
                size={32}
                color={this.state.viewPostsIsFocused ? "#000" : "#B8BBC4"}
              ></Ionicons>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                this.state.viewPostsIsFocused
                  ? styles.defaultTag
                  : {
                      ...styles.defaultTag,
                      borderBottomWidth: 1,
                      borderBottomColor: "#000"
                    }
              }
              onPress={() => this.setState({ viewPostsIsFocused: false })}
            >
              <MaterialIcons
                name="person-pin"
                size={32}
                color={this.state.viewPostsIsFocused ? "#B8BBC4" : "#000"}
              ></MaterialIcons>
            </TouchableOpacity>
          </View>

          {this.handleViewPosts()}

          <Modal
            visible={this.state.modalVisible}
            animationType="fade"
            transparent={true}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#000",
                opacity: 0.7
              }}
              onPress={() => {
                this.setState({ modalVisible: false });
              }}
              activeOpacity={0.7}
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.modal}
              activeOpacity={1}
              onPress={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <View
                style={{
                  height: 4,
                  width: "10%",
                  backgroundColor: "#B8BBC4",
                  borderRadius: 10,
                  marginTop: 12
                }}
              ></View>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 24
                }}
              >
                <RNImg
                  source={
                    this.state.user.avatar
                      ? { uri: this.state.user.avatar }
                      : require("../assets/tempAvatar.png")
                  }
                  style={{
                    height: 56,
                    width: 56,
                    borderRadius: 30,
                    marginLeft: 12
                  }}
                ></RNImg>
                <Text
                  style={{
                    position: "absolute",
                    left: "22%",
                    color: "#3299F3",
                    fontWeight: "600"
                  }}
                >
                  {this.state.user.username}
                </Text>
                <Ionicons
                  name="ios-checkmark-circle"
                  size={28}
                  color="#3299F3"
                  style={{ marginRight: 12 }}
                ></Ionicons>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  paddingVertical: 12,
                  borderBottomWidth: StyleSheet.hairlineWidth * 2,
                  borderBottomColor: "#E0E0E0"
                }}
              >
                <TouchableOpacity
                  style={{ ...styles.detailButton, marginLeft: 4 }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {this.state.followers.length} Followers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ ...styles.detailButton, marginRight: 4 }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Add Close Friends
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#FFF",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 40
                }}
                onPress={() => Fire.shared.signOutUser()}
              >
                <AntDesign
                  name="plus"
                  size={28}
                  style={{ right: 25 }}
                ></AntDesign>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                  Log In or Create New Account
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB"
  },

  modal: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    backgroundColor: "#FFF",
    justifyContent: "flex-start",
    width: "100%",
    height: "33%",
    borderRadius: 16,
    opacity: 1
  },

  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 18
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginLeft: 18
  },

  attribute: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
  },

  attributeText: {
    fontSize: 18,
    fontWeight: "500"
  },

  button: {
    height: 28,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    backgroundColor: "#FFF",
    marginBottom: 8
  },

  defaultPosts: {
    width: "50%",
    borderBottomWidth: 1,
    alignItems: "center"
  },

  defaultTag: {
    paddingBottom: 3,
    width: "50%",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0",
    alignItems: "center"
  },

  detailButton: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    width: "45%",
    paddingVertical: 6,
    borderRadius: 6
  }
});
