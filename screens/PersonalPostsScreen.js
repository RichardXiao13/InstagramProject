import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";
import { Image, Avatar } from "react-native-elements";
import { Ionicons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";

export default class PersonalPostsScreen extends React.Component {
  state = {
    posts: this.props.navigation.state.params.posts,
    username: this.props.navigation.state.params.username,
    avatar: this.props.navigation.state.params.avatar,
    modalVisible: false,
    comment: "",
    currentPost: {}
  };

  addComment = async () => {
    const comment = this.state.comment;
    this.setState({ comment: "", modalVisible: false });
    await Fire.shared.addComment(this.state.currentPost, comment);
  };

  renderPost = (post, index) => {
    return (
      <View style={styles.feedItem}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Avatar
                size="small"
                source={{ uri: this.state.avatar }}
                rounded
                containerStyle={{ marginHorizontal: 12 }}
              ></Avatar>
              <Text style={styles.name}>{this.state.username}</Text>
            </View>

            <Ionicons
              name="ios-more"
              size={20}
              color="#2A2A2A"
              style={{ marginRight: 16 }}
            ></Ionicons>
          </View>

          <Image
            source={{ uri: post.image }}
            resizeMode="cover"
            containerStyle={styles.postImage}
          ></Image>

          <View style={{ flexDirection: "row", marginTop: 4, width: "100%" }}>
            <TouchableOpacity
              style={{ marginLeft: 5, paddingHorizontal: 9 }}
              onPress={() => this.handleLikePost(post, index)}
            >
              {post.liked ? (
                <Ionicons name="ios-heart" size={30} color="#E82560"></Ionicons>
              ) : (
                <Ionicons
                  name="ios-heart-empty"
                  size={30}
                  color="#2A2A2A"
                ></Ionicons>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingHorizontal: 9 }}
              onPress={() =>
                this.props.navigation.navigate("comments", {
                  post
                })
              }
            >
              <Ionicons
                name="ios-chatbubbles"
                size={30}
                color="#2A2A2A"
              ></Ionicons>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingHorizontal: 9 }}
              onPress={() => this.props.navigation.navigate("messages")}
            >
              <Ionicons
                name="md-paper-plane"
                size={30}
                color="#2A2A2A"
              ></Ionicons>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginLeft: "55%" }}>
              <FontAwesome
                name="bookmark-o"
                size={30}
                color="#2A2A2A"
              ></FontAwesome>
            </TouchableOpacity>
          </View>

          <Text style={{ marginHorizontal: 14 }}>
            <Text style={{ fontWeight: "500", fontSize: 14 }}>
              {post.username}
            </Text>
            <Text style={styles.post}> {post.text}</Text>
          </Text>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("comments", {
                post
              })
            }
          >
            <Text style={{ ...styles.subtitle, marginHorizontal: 14 }}>
              View comments
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 14,
              marginVertical: 6
            }}
          >
            <Avatar size={26} source={{ uri: this.state.avatar }} rounded />

            <TouchableOpacity
              onPress={() =>
                this.setState({
                  modalVisible: true,
                  currentPost: this.state.posts[index]
                })
              }
            >
              <Text style={styles.subtitle}>Add a comment...</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.timestamp}>
            {moment(post.timestamp).fromNow()}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    if (this.state.posts) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{ paddingHorizontal: 14, paddingVertical: 8 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <SimpleLineIcons name="arrow-left" size={18}></SimpleLineIcons>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>SocialAppExample</Text>

            <TouchableOpacity
              style={{ paddingLeft: 7, paddingRight: 14, paddingVertical: 8 }}
              activeOpacity={1}
            >
              <Text style={{fontWeight: "400", fontSize: 18}}>Edit</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={this.state.posts}
            renderItem={({ item, index }) => this.renderPost(item, index)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />

          <Modal
            visible={this.state.modalVisible}
            style={styles.modal}
            transparent
            animationType="slide"
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.setState({ modalVisible: false, comment: "" })}
            ></TouchableOpacity>
            <View
              style={{ flex: 1, backgroundColor: "#FFF", paddingBottom: 20 }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "flex-start"
                }}
              >
                <Avatar
                  size={48}
                  source={{ uri: this.state.avatar }}
                  rounded
                  containerStyle={{ marginLeft: 16, marginRight: 8 }}
                />
                <View style={styles.comment}>
                  <TextInput
                    placeholder="Add a comment..."
                    autoFocus
                    style={{ paddingLeft: 14 }}
                    onChangeText={comment => this.setState({ comment })}
                    value={this.state.comment}
                  ></TextInput>

                  <TouchableOpacity
                    style={{ padding: 8 }}
                    onPress={() => this.addComment()}
                  >
                    <Text
                      style={
                        this.state.comment
                          ? { color: "#3299F3", fontWeight: "500" }
                          : { color: "#bbe2fb", fontWeight: "500" }
                      }
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
    backgroundColor: "#FFF"
  },

  header: {
    flexDirection: "row",
    paddingTop: 52,
    backgroundColor: "#FBFBFB",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0"
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "500"
  },

  feedItem: {
    backgroundColor: "#FFF",
    flexDirection: "row"
  },

  name: {
    fontSize: 15,
    fontWeight: "500"
  },

  timestamp: {
    fontSize: 11,
    color: "#A8A8A8",
    marginBottom: 8,
    marginHorizontal: 14
  },

  post: {
    marginVertical: 6,
    fontSize: 14,
    color: "#3F3F3F"
  },

  postImage: {
    marginTop: 10,
    width: "100%",
    aspectRatio: 1,
    marginBottom: 10
  },

  modal: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },

  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#E0E0E0",
    paddingVertical: 6,
    width: "76%",
    height: 50
  },

  subtitle: {
    marginHorizontal: 7,
    marginVertical: 8,
    color: "#A8A8A8"
  }
});
