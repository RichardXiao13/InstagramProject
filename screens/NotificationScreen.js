import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import MessageNotification from "../components/MessageNotification";
import FollowNotification from "../components/FollowNotification";
import LikeNotification from "../components/LikeNotification";
import Fire from "../Fire";

export default class NotificationScreen extends React.Component {
  state = {
    notifications: [],
    isRefreshing: false
  };

  getNotifications = async () => {
    const user = Fire.shared.uid;

    try {
      const snapshot = await Fire.shared.firestore
        .collection("users")
        .doc(user)
        .collection("notifications")
        .get();

      let notifications = snapshot.docs.map(async doc => {
        const notificationData = doc.data();
        const userData = await Fire.shared.getUser(notificationData.uid);
        return { ...userData, ...notificationData, timestamp: doc.id };
      });
      notifications = await Promise.all(notifications);
      notifications.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({ notifications, isRefreshing: false });
    } catch (error) {
      console.log(error);
    }
  };

  renderNotification = notification => {
    if (notification.type === "message") {
      return <MessageNotification user={notification} />;
    } else if (notification.type === "follow") {
      return <FollowNotification user={notification} />;
    } else if (notification.type === "like") {
      return <LikeNotification user={notification} />;
    }
  };

  componentDidMount() {
    this.getNotifications();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>

        <FlatList
          style={{ flex: 1, width: "100%", backgroundColor: "#FFF" }}
          data={this.state.notifications}
          renderItem={({ item }) => this.renderNotification(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshing={this.state.isRefreshing}
          onRefresh={() => {
            this.setState({ isRefreshing: true });
            this.getNotifications();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },

  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBFBFB",
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#E0E0E0"
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "500"
  }
});
