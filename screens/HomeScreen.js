import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Image, Avatar } from "react-native-elements";
import { Ionicons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";

export default class HomeScreen extends React.Component {
  state = {
    posts: []
  };

  getPosts = async () => {
    const user = Fire.shared.uid;
    const snapshot = await Fire.shared.firestore
      .collection("users")
      .doc(user)
      .collection("following")
      .get();

    const following = snapshot.docs.map(doc => doc.id);

    let posts = [];
    following.forEach(async (follow, index) => {
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(follow)
        .collection("posts")
        .get();
      const user = await Fire.shared.firestore
        .collection("users")
        .doc(follow)
        .get();
      const followPost = snapshot.docs.map(doc => doc.data());
      for (let i = 0; i < followPost.length; i++) {
        posts.push({
          ...followPost[i],
          avatar: user.data().avatar,
          username: user.data().username
        });
        if (i === followPost.length - 1 && index === following.length - 1) {
          posts.sort((a, b) => b.timestamp - a.timestamp);
          this.setState({ posts });
        }
      }
    });
  };

  componentDidMount() {
    this.getPosts();
  }

  renderPost = post => {
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
                source={{ uri: post.avatar }}
                rounded
                containerStyle={{ marginHorizontal: 12 }}
              ></Avatar>
              <Text style={styles.name}>{post.username}</Text>
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
            style={styles.postImage}
            resizeMode="cover"
            containerStyle={{ marginTop: 12 }}
          ></Image>

          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <Ionicons
              name="ios-heart-empty"
              size={30}
              color="#2A2A2A"
              style={{ marginLeft: 14 }}
            ></Ionicons>
            <Ionicons
              name="ios-chatbubbles"
              size={30}
              color="#2A2A2A"
              style={{ marginHorizontal: 18 }}
            ></Ionicons>
            <Ionicons
              name="md-paper-plane"
              size={30}
              color="#2A2A2A"
            ></Ionicons>
            <FontAwesome
              name="bookmark-o"
              size={30}
              color="#2A2A2A"
              style={{ marginLeft: "57%" }}
            ></FontAwesome>
          </View>

          <Text style={{ marginHorizontal: 14 }}>
            <Text style={{ fontWeight: "500", fontSize: 14 }}>
              {post.username}
            </Text>
            <Text style={styles.post}> {post.text}</Text>
          </Text>

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
            >
              <SimpleLineIcons name="camera" size={26}></SimpleLineIcons>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>SocialAppExample</Text>

            <TouchableOpacity
              style={{ paddingHorizontal: 14, paddingVertical: 8 }}
              activeOpacity={0}
              onPress={() => this.props.navigation.navigate("messages")}
            >
              <Ionicons name="md-paper-plane" size={26}></Ionicons>
            </TouchableOpacity>
          </View>

          <FlatList
            data={this.state.posts}
            renderItem={({ item }) => this.renderPost(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    } else {
      return <View></View>;
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
    marginVertical: 8,
    marginHorizontal: 14
  },

  post: {
    marginTop: 6,
    fontSize: 14,
    color: "#3F3F3F"
  },

  postImage: {
    width: "100%",
    height: 500,
    marginVertical: 10
  }
});
