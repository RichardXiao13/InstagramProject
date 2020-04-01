import FirebaseKeys from "./config";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import firebase from "firebase";
import "firebase/firestore";

import { Alert } from "react-native";

class Fire {
  constructor() {
    firebase.initializeApp(FirebaseKeys);
  }

  addPost = async ({ text, localUri }) => {
    const timestamp = this.timestamp;
    const remoteUri = await this.uploadPhotoAsync(
      localUri,
      `photos/${this.uid}/${timestamp}`
    );

    return new Promise((resolve, reject) => {
      this.firestore
        .collection("users")
        .doc(this.uid)
        .collection("posts")
        .add({
          text,
          uid: this.uid,
          timestamp: timestamp,
          image: remoteUri
        })
        .then(reference => {
          resolve(reference);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  uploadPhotoAsync = async (uri, filename) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase
        .storage()
        .ref(filename)
        .put(file);

      upload.on(
        "state_changed",
        snapshot => {},
        error => {
          reject(error);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          resolve(url);
        }
      );
    });
  };

  createUser = async user => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);

      let db = this.firestore.collection("users").doc(this.uid);

      db.set({
        username: user.username,
        email: user.email
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateProfile = user => {
    let db = this.firestore.collection("users").doc(this.uid);

    db.set({ ...user });
  };

  getUsername = async () => {
    try {
      const user = await this.firestore
        .collection("users")
        .doc(this.uid)
        .get();
      return user.data().username;
    } catch (error) {
      console.log(error);
    }
  };

  signOutUser = async () => {
    Alert.alert(`Log out of ${await this.getUsername()}?`, "", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Log Out",
        onPress: async () => {
          try {
            await firebase.auth().signOut();
          } catch (error) {
            console.log(error);
          }
        }
      }
    ]);
  };

  createNotification = (recipientUID, type) => {
    try {
      this.firestore
        .collection("users")
        .doc(recipientUID)
        .collection("notifications")
        .doc(this.timestamp.toString())
        .set({
          uid: this.uid,
          type
        });
    } catch (error) {
      console.log(error);
    }
  };

  sendMessage = async (recipientUID, message) => {
    const user = this.firestore
      .collection("users")
      .doc(this.uid)
      .collection("messages")
      .doc(recipientUID);
    try {
      const userData = await user.get();
      if (userData.exists) {
        await user.update({
          [this.timestamp]: message
        });
      } else {
        user.set({
          [this.timestamp]: message
        });
      }
      this.createNotification(recipientUID, "message");
    } catch (error) {
      console.log(error);
    }
  };

  getMessages = async recipientUID => {
    const user = this.firestore
      .collection("users")
      .doc(this.uid)
      .collection("messages")
      .doc(recipientUID);
    const recipient = this.firestore
      .collection("users")
      .doc(recipientUID)
      .collection("messages")
      .doc(this.uid);
    try {
      const sortMessages = (userData, isCurrentUser) => {
        let messages = [];
        Object.keys(userData)
          .sort()
          .forEach(key => {
            messages.push({
              timestamp: parseInt(key),
              message: userData[key],
              thisUser: isCurrentUser
            });
          });
        return messages;
      };

      let thisUserData = user.get();
      let recipientData = recipient.get();
      let messages = await Promise.all([thisUserData, recipientData]);
      thisUserData = messages[0].data();
      recipientData = messages[1].data();

      if (!thisUserData && !recipientData) {
        return;
      } else if (!thisUserData) {
        messages = sortMessages(recipientData, false);
      } else if (!recipientData) {
        messages = sortMessages(thisUserData, true);
      } else {
        messages = [
          ...sortMessages(thisUserData, true),
          ...sortMessages(recipientData, false)
        ];
        messages.sort((a, b) => b.timestamp - a.timestamp);
      }

      return messages;
    } catch (error) {
      console.log(error);
    }
  };

  followRequest = async (thisUser, recipient, status) => {
    const follower = Fire.shared.firestore
      .collection("users")
      .doc(recipient)
      .collection("followers")
      .doc(thisUser)
      .set({ following: status });

    const following = Fire.shared.firestore
      .collection("users")
      .doc(thisUser)
      .collection("following")
      .doc(recipient)
      .set({ following: status });

    if (status) {
      this.createNotification(recipient, "follow");
    }

    await Promise.all([follower, following]);
  };

  getUser = async uid => {
    const user = await this.firestore
      .collection("users")
      .doc(uid)
      .get();

    return user.data();
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
