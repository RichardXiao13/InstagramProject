import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SearchBar, ListItem } from "react-native-elements";
import Fire from "../Fire";

export default class SearchScreen extends React.Component {
  state = {
    search: "",
    possible: [],
    renderSearch: false
  };

  renderProfile = user => {
    if (user) {
      return (
        <ListItem
          leftAvatar={{ source: { uri: user.avatar } }}
          title={user.username}
          subtitle={user.name}
          subtitleStyle={{ color: "#A5A5A5" }}
          activeOpacity={0.9}
          onPress={() =>
            this.props.navigation.navigate("otherProfile", {
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
          <SearchBar
            placeholder="Search"
            platform="ios"
            containerStyle={{ backgroundColor: "#FBFBFB", height: 50 }}
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
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FBFBFB",
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 10
  }
});
