import * as Permissions from "expo-permissions";

class UserPermissions {
  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status != "granted") {
      alert("We need permission to access your camera roll.");
    }
  };
}

export default new UserPermissions();
