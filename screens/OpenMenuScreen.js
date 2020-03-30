import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { SearchBar, ListItem } from "react-native-elements";
import {
  SimpleLineIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  Entypo
} from "@expo/vector-icons";
import Fire from "../Fire";

export default class OpenMenuScreen extends React.Component {
  handleSignOut = () => {
    Fire.shared.signOutUser();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{
              padding: 12,
              position: "relative",
              right: Dimensions.get("window").width * 0.3
            }}
            onPress={() => this.props.navigation.goBack()}
          >
            <SimpleLineIcons name="arrow-left" size={18}></SimpleLineIcons>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <ScrollView
          style={{ width: "100%", backgroundColor: "#FFF" }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <SearchBar
            placeholder="Search"
            platform="ios"
            containerStyle={styles.searchBar}
            inputContainerStyle={{
              backgroundColor: "#EFEFEF",
              borderRadius: 12
            }}
            cancelButtonProps={{ color: "#000" }}
            autoCorrect={false}
            autoCapitalize="none"
          ></SearchBar>
          <View style={{ alignItems: "center" }}>
            <ListItem
              title="Follow and Invite Friends"
              containerStyle={{ width: "100%" }}
              leftIcon={
                <MaterialCommunityIcons name="account-plus-outline" size={25} />
              }
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Your Activity"
              containerStyle={{ width: "100%" }}
              leftIcon={
                <MaterialCommunityIcons name="progress-clock" size={24} />
              }
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Notifications"
              containerStyle={{ width: "100%" }}
              leftIcon={
                <MaterialCommunityIcons name="bell-outline" size={24} />
              }
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Privacy"
              containerStyle={{ width: "100%" }}
              leftIcon={<Feather name="lock" size={24} />}
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Security"
              containerStyle={{ width: "100%" }}
              leftIcon={
                <MaterialCommunityIcons name="shield-outline" size={24} />
              }
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Payments"
              containerStyle={{ width: "100%" }}
              leftIcon={<FontAwesome name="credit-card" size={24} />}
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Ads"
              containerStyle={{ width: "100%" }}
              leftIcon={<Entypo name="megaphone" size={24} />}
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Account"
              containerStyle={{ width: "100%" }}
              leftIcon={
                <MaterialCommunityIcons name="account-circle" size={24} />
              }
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="Help"
              containerStyle={{ width: "100%" }}
              leftIcon={<Ionicons name="ios-help-circle-outline" size={28} />}
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
            ></ListItem>

            <ListItem
              title="About"
              containerStyle={{ width: "100%" }}
              leftIcon={<SimpleLineIcons name="info" size={22} />}
              rightIcon={
                <Feather name="chevron-right" size={24} color="#B8BBC4" />
              }
              bottomDivider
            ></ListItem>

            <ListItem
              title="Logins"
              titleStyle={{ fontWeight: "500" }}
              containerStyle={{ width: "100%" }}
            ></ListItem>

            <ListItem
              title="Add Account"
              titleStyle={{ color: "#3299F3" }}
              containerStyle={{ width: "100%" }}
            ></ListItem>

            <ListItem
              title="Log Out"
              titleStyle={{ color: "#3299F3" }}
              containerStyle={{ width: "100%" }}
              onPress={() => Fire.shared.signOutUser()}
              bottomDivider
            ></ListItem>
          </View>

          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F8F8F8",
              padding: 16
            }}
          >
            <Text style={{ color: "#9C9C9C" }}>from</Text>
            <Text style={{ fontWeight: "500" }}>RICHARD XIAO</Text>
          </View>
        </ScrollView>
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
    flexDirection: "row",
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#FBFBFB",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0",
    width: "100%"
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginRight: Dimensions.get("window").width * 0.11
  },

  searchBar: {
    backgroundColor: "#FFF",
    height: 40,
    marginTop: 8,
    width: "97%"
  }
});
