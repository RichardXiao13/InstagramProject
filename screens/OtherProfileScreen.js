import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image as RNImg
} from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "react-native-elements";
import Fire from "../Fire";

export default class OtherProfileScreen extends React.Component {
  state = {
    user: this.props.navigation.state.params.user,
    posts: [],
    followers: [],
    following: [],
    viewPostsIsFocused: true,
    isFollowing: false
  };

  getPosts = async () => {
    try {
      const uid = this.state.user.uid;
      let snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(uid)
        .collection("posts")
        .get();

      this.setState({ posts: snapshot.docs.map(doc => doc.data()) });
    } catch (error) {
      console.log(error);
    }
  };

  getFollowers = async () => {
    try {
      const uid = this.state.user.uid;
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(uid)
        .collection("followers")
        .get();

      this.setState({ followers: snapshot.docs.map(doc => doc.data()) });
    } catch (error) {
      console.log(error);
    }
  };

  getFollowing = async () => {
    try {
      const user = this.state.user.uid;
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(user)
        .collection("following")
        .get();

      this.setState({ following: snapshot.docs.map(doc => doc.data()) });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getPosts();
    this.getFollowers();
    this.getFollowing();
  }

  componentWillUnmount() {
    this.setState({ isRendered: false });
  }

  handleFollowRequest = async () => {
    const user = this.props.uid || Fire.shared.uid;

    await Fire.shared.firestore
      .collection("users")
      .doc(this.state.user.uid)
      .collection("followers")
      .doc(user)
      .set({ following: !this.state.isFollowing });

    await Fire.shared.firestore
      .collection("users")
      .doc(user)
      .collection("following")
      .doc(this.state.user.uid)
      .set({ following: !this.state.isFollowing });

    this.getPosts();
    this.getFollowers();
    this.setState({ isFollowing: !this.state.isFollowing });
  };

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
            width: Dimensions.get("window").width * 0.33,
            height: Dimensions.get("window").width * 0.33,
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
            <TouchableOpacity>
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
            />
          </View>
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 56
          }}
        >
          <TouchableOpacity style={{ padding: 18 }} onPress={() => this.props.navigation.goBack()}>
            <SimpleLineIcons
              name="arrow-left"
              size={18}
            ></SimpleLineIcons>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "500", marginRight: 18 }}>
              {this.state.user.username}
            </Text>
          </View>

          <TouchableOpacity>
            <Ionicons
              name="ios-more"
              size={22}
              style={{ marginRight: 18 }}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View style={styles.avatarContainer}>
            <RNImg
              source={
                this.state.user.avatar
                  ? { uri: this.state.user.avatar }
                  : require("../assets/tempAvatar.png")
              }
              style={{ width: 90, height: 90, borderRadius: 50 }}
            ></RNImg>
          </View>

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

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={
              !this.state.isFollowing
                ? {
                    ...styles.button,
                    backgroundColor: "#3299F3",
                    borderWidth: 0
                  }
                : styles.button
            }
            onPress={this.handleFollowRequest}
          >
            <Text
              style={
                !this.state.isFollowing
                  ? { textAlign: "center", fontWeight: "600", color: "#FFF" }
                  : { textAlign: "center", fontWeight: "600" }
              }
            >
              {!this.state.isFollowing ? "Follow" : "Unfollow"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={{ textAlign: "center", fontWeight: "600" }}>
              Message
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.button, width: "8%", alignItems: "center" }}
          >
            <Ionicons name="ios-arrow-down" size={14}></Ionicons>
          </TouchableOpacity>
        </View>

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
      </View>
    );
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
    width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    backgroundColor: "#FFF",
    marginBottom: 8,
    marginHorizontal: 3
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
