import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { EvilIcons, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import moment from "moment";
import Fire from "../Fire";

export default class CommentsScreen extends React.Component {
  state = {
    post: this.props.navigation.state.params.post,
    comments: []
  };

  renderComments = comment => {
    return (
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            source={{ uri: comment.user.avatar }}
            rounded
            containerStyle={{ marginBottom: 10 }}
          />
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.username}>{comment.user.username}</Text>
              <Text style={{ marginHorizontal: 6 }}>{comment.comment}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 6
              }}
            >
              <Text style={styles.timestamp}>
                {moment(parseInt(comment.timestamp)).fromNow()}
              </Text>

              <TouchableOpacity style={{ paddingHorizontal: 8 }}>
                <Text style={styles.reply}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity>
          <EvilIcons
            name="heart"
            size={18}
            color="#999999"
            style={{ padding: 6 }}
          ></EvilIcons>
        </TouchableOpacity>
      </View>
    );
  };

  getComments = async () => {
    const ref = Fire.shared.firestore.collection("users");
    let comments = await ref
      .doc(this.state.post.uid)
      .collection("posts")
      .doc(this.state.post.postId)
      .collection("comments")
      .get();

    comments = comments.docs.map(async doc => {
      const commentData = doc.data();
      const user = await ref.doc(commentData.user).get();
      return {
        timestamp: doc.id,
        comment: commentData.comment,
        user: user.data()
      };
    });

    comments = await Promise.all(comments);

    comments.sort((a, b) => a.timestamp - b.timestamp);
    this.setState({ comments });
  };

  componentDidMount() {
    this.getComments();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcons}
            onPress={() => this.props.navigation.goBack()}
          >
            <SimpleLineIcons name="arrow-left" size={18}></SimpleLineIcons>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Comments</Text>

          <TouchableOpacity
            style={styles.headerIcons}
            onPress={() => this.props.navigation.navigate("messages")}
          >
            <Ionicons name="md-paper-plane" size={26}></Ionicons>
          </TouchableOpacity>
        </View>

        <View
          style={{
            ...styles.listItem,
            width: "100%",
            backgroundColor: "#FFF",
            borderBottomWidth: StyleSheet.hairlineWidth * 2,
            borderBottomColor: "#E0E0E0"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar
              source={{ uri: this.state.post.avatar }}
              rounded
              containerStyle={{ marginBottom: 10 }}
            />
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.username}>{this.state.post.username}</Text>
                <Text style={{ marginHorizontal: 6 }}>
                  {this.state.post.text}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 6
                }}
              >
                <Text style={styles.timestamp}>
                  {moment(parseInt(this.state.post.timestamp)).fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={this.state.comments}
          renderItem={({ item }) => this.renderComments(item)}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1, backgroundColor: "#FFF", width: "100%" }}
        />
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
    paddingTop: 40,
    backgroundColor: "#FBFBFB",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 4
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "500"
  },

  headerIcons: {
    padding: 10
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14
  },

  username: {
    fontWeight: "500"
  },

  timestamp: {
    fontSize: 12,
    fontWeight: "300",
    color: "#A8A8A8"
  },
  reply: {
    fontSize: 13,
    fontWeight: "500",
    color: "#999999"
  }
});
