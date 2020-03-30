import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";

export default class RegisterScreen extends React.Component {
  state = {
    user: {
      username: "",
      email: "",
      password: ""
    },
    errorMessage: null
  };

  handleSignUp = () => {
    Fire.shared.createUser(this.state.user);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>

        <Image
          source={require("../assets/authHeader.png")}
          style={{ width: "100%", height: 200 }}
        ></Image>

        <Image
          source={require("../assets/authFooter.png")}
          style={{
            width: "100%",
            height: 200,
            position: "absolute",
            bottom: -75
          }}
        ></Image>

        <TouchableOpacity
          style={styles.back}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons
            name="ios-arrow-round-back"
            size={32}
            color="#FFF"
          ></Ionicons>
        </TouchableOpacity>

        <Text style={styles.greeting}>{`Hello!\nSign up to get started.`}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Username</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={username => {
                this.setState({ user: { ...this.state.user, username } });
              }}
              value={this.state.user.username}
            ></TextInput>
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => {
                this.setState({ user: { ...this.state.user, email } });
              }}
              value={this.state.user.email}
            ></TextInput>
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              // onFocus={() => this.props.navigation.navigate("Password")}
              onChangeText={password =>
                this.setState({ user: { ...this.state.user, password } })
              }
              value={this.state.user.password}
            ></TextInput>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            Have an account?{" "}
            <Text style={{ color: "#62B1F6", fontWeight: "500" }}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center"
  },

  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },

  error: {
    color: "#62B1F6",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },

  form: {
    marginBottom: 48,
    marginHorizontal: 30
  },

  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase"
  },

  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D"
  },

  button: {
    marginHorizontal: 30,
    backgroundColor: "#62B1F6",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },

  back: {
    position: "absolute",
    top: 40,
    left: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(21, 22, 48, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  }
});
