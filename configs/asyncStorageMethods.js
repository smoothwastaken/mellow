import AsyncStorage from "@react-native-async-storage/async-storage";

export const setASItem = async (itemName, item) => {
  try {
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(itemName, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getASItem = async (itemName, callback) => {
  try {
    const jsonValue = await AsyncStorage.getItem(itemName);
    callback
      ? callback(jsonValue != null ? JSON.parse(jsonValue) : null)
      : null;
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeASItem = async (itemName, callback) => {
  try {
    await AsyncStorage.removeItem(itemName);
    callback ? callback() : null;
  } catch (e) {
    console.log(e);
  }
};
