import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button } from "react-native-elements";

export default class PasswordScreen extends React.Component {
  state = {
    password: ""
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Password</Text>
        </View>
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
          onChangeText={password => {
            this.setState({ password });
          }}
          value={this.state.password}
        ></TextInput>
        <Button
          title="Done"
          containerStyle={{ marginTop: 18, marginHorizontal: 10 }}
          buttonStyle={{ height: 60, borderRadius: 14 }}
          titleStyle={{ fontSize: 24 }}
          raised
          onPress={() =>
            this.props.navigation.navigate("Register", {
              password: this.state.password
            })
          }
        ></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#FFF"
  },

  header: {
    alignItems: "center",
    paddingTop: 50
  },

  headerText: {
    fontSize: 24,
    fontWeight: "500"
  },

  input: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 10,
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: "#8A8F9E",
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    height: 50,
    fontSize: 20,
    color: "#161F3D"
  }
});
