import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons, Foundation, FontAwesome } from "@expo/vector-icons";

import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screens/HomeScreen";
import MessagesScreen from "./screens/MessagesScreen";
import MessageUserScreen from "./screens/MessageUserScreen";
import CommentsScreen from "./screens/CommentsScreen";

import SearchScreen from "./screens/SearchScreen";
import NotificationScreen from "./screens/NotificationScreen";
import PostScreen from "./screens/PostScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import PersonalPostsScreen from "./screens/PersonalPostsScreen";
import OpenMenuScreen from "./screens/OpenMenuScreen";
import OtherProfileScreen from "./screens/OtherProfileScreen";

const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Foundation name="home" size={30} color={tintColor}></Foundation>
            )
          }
        },

        Search: {
          screen: SearchScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons
                name="ios-search"
                size={30}
                color={tintColor}
              ></Ionicons>
            )
          }
        },

        Post: {
          screen: PostScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <FontAwesome
                name="plus-square-o"
                size={30}
                color={tintColor}
              ></FontAwesome>
            )
          }
        },

        Notifications: {
          screen: NotificationScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="ios-heart" size={30} color={tintColor}></Ionicons>
            )
          }
        },

        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="md-person" size={30} color={tintColor}></Ionicons>
            )
          }
        }
      },
      {
        defaultNavigationOptions: {
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            if (navigation.state.key === "Post") {
              navigation.navigate("postModal");
            } else {
              defaultHandler();
            }
          }
        },

        tabBarOptions: {
          activeTintColor: "#171717",
          inactiveTintColor: "#B8BBC4",
          showLabel: false
        },
        initialRouteName: "Home"
      }
    ),
    postModal: {
      screen: PostScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    editProfileModal: {
      screen: EditProfileScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    personalPosts: {
      screen: PersonalPostsScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    openMenuModal: {
      screen: OpenMenuScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    otherProfile: {
      screen: OtherProfileScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    messages: {
      screen: MessagesScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    messageUser: {
      screen: MessageUserScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    },

    comments: {
      screen: CommentsScreen,
      navigationOptions: {
        gestureEnabled: false
      }
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen
  },
  {
    headerMode: "none"
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);
