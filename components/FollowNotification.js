import React from "react";
import { StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import moment from "moment";

const FollowNotification = ({ user }) => {
  return (
    <ListItem
      leftAvatar={{ source: { uri: user.avatar } }}
      title={user.username}
      titleStyle={styles.title}
      subtitle={`Started following you ${moment(parseInt(user.timestamp)).fromNow()}.`}
      subtitleStyle={styles.subtitle}
      
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "500"
  },

  subtitle: {
    fontSize: 14,
    color: "#808080"
  }
});

export default FollowNotification;
