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

export default class PersonalPostsScreen extends React.Component {
  state = {
    posts: this.props.navigation.state.params.posts,
    username: this.props.navigation.state.params.username,
    avatar: this.props.navigation.state.params.avatar
  };

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
                source={{ uri: this.state.avatar }}
                containerStyle={{ marginHorizontal: 12 }}
                rounded
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
              {this.state.username}
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
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ paddingHorizontal: 18, paddingVertical: 8 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <SimpleLineIcons name="arrow-left" size={18}></SimpleLineIcons>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{this.state.username}</Text>
          <Text style={styles.edit}>Edit</Text>
        </View>

        <FlatList
          data={this.state.posts}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={item => item.image}
          showsVerticalScrollIndicator={false}
        />
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
    flexDirection: "row",
    paddingTop: 56,
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

  edit: {
    marginRight: 18,
    fontSize: 17
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
