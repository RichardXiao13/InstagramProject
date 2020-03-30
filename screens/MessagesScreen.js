import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import {
  SimpleLineIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { SearchBar, ListItem } from "react-native-elements";
import Fire from "../Fire";

export default class MessagesScreen extends React.Component {
  state = {
    possible: [],
    people: []
  };

  getPeople = async () => {
    const user = Fire.shared.uid;
    const people = await Fire.shared.firestore
      .collection("users")
      .doc(user)
      .collection("messages")
      .get();
    const peopleData = people.docs.map(doc => doc.id);
  };

  renderProfile = user => {
    if (user) {
      return (
        <ListItem
          leftAvatar={{ source: { uri: user.avatar }, size: 60 }}
          rightIcon={
            <SimpleLineIcons
              name="camera"
              size={26}
              color="#999999"
            ></SimpleLineIcons>
          }
          title={user.username}
          subtitle="Last Active"
          subtitleStyle={{ color: "#A5A5A5" }}
          activeOpacity={0.9}
          onPress={() =>
            this.props.navigation.navigate("messageUser", {
              user: user
            })
          }
        />
      );
    }
  };

  searchUsers = async name => {
    const snapshot = await Fire.shared.firestore.collection("users").get();

    const users = snapshot.docs.map(doc => {
      const user = doc.data();
      if (
        name &&
        user.username.startsWith(name.trim()) &&
        doc.id != Fire.shared.uid
      ) {
        return { ...user, uid: doc.id };
      }
    });

    this.setState({ possible: users });
  };

  handleSearchText = text => {
    this.setState({ search: text });
    this.searchUsers(text);
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

          <Text style={styles.headerTitle}>Direct</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity>
              <AntDesign
                name="videocamera"
                size={24}
                style={{ paddingVertical: 6, paddingHorizontal: 9 }}
              ></AntDesign>
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={26}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 9,
                  marginRight: 9
                }}
              ></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingTop: 10, backgroundColor: "#FFF" }}>
          <SearchBar
            placeholder="Search"
            platform="ios"
            containerStyle={{
              backgroundColor: "#FFF",
              height: 38,
              marginHorizontal: 6
            }}
            inputContainerStyle={{
              backgroundColor: "#F0F1F3",
              borderRadius: 12
            }}
            onChangeText={this.handleSearchText}
            onClear={() => this.setState({ possible: [] })}
            value={this.state.search}
            cancelButtonProps={{ color: "#000" }}
            autoCorrect={false}
            autoCapitalize="none"
          ></SearchBar>
        </View>

        <FlatList
          data={this.state.possible}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderProfile(item)}
          style={{ flex: 1, backgroundColor: "#FFF" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },

  header: {
    flexDirection: "row",
    paddingTop: 48,
    backgroundColor: "#FBFBFB",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0"
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 45
  }
});
