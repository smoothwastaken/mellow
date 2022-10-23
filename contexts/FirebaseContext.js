import { createContext, useId } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../configs/firebase";
import { signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import debounce from "lodash.debounce";

export const onGenerateIds = (length = 20) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const onCreateUserDocs = async (userId, name, username, ppURI) => {
  const today = new Date();

  try {
    const userDocRef = await setDoc(doc(db, "users", userId), {
      name: name,
      username: username,
      ppURI: ppURI
        ? ppURI
        : "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg",
      creationDate: `${today.getDate()}*${
        today.getMonth() + 1
      }*${today.getFullYear()}`,
      friends: [],
      pendingFriends: [],
      friendRequests: [],
      platform: "ytb",
    });
    alert("User created !");
  } catch (e) {
    alert("Error adding document: ", e);
    console.error("Error adding document: ", e);
  }

  try {
    const usernameDocRef = await setDoc(doc(db, "usernames", username), {
      name: name,
      username: username,
      uid: userId,
      friends: [],
      pendingFriends: [],
      friendRequests: [],
      ppURI: ppURI
        ? ppURI
        : "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg",
      creationDate: `${today.getDate()}${
        today.getMonth() + 1
      }${today.getFullYear()}`,
    });
    alert("User created !");
  } catch (e) {
    alert("Error adding document: ", e);
    console.error("Error adding document: ", e);
  }
};

export const onFetchUserPrivateInfos = async (userId, callback) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      console.log("No such document!");
      callback(false);
    }
  } catch (e) {
    console.log(e);
  }
};

export const onFetchUserPublicInfos = async (username, callback) => {
  try {
    const docRef = doc(db, "usernames", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.log(e);
  }
};

export const onFetchFriendsMellows = async (friendList, callback) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "mellows"), where("authorId", "in", friendList))
    );
    callback ? callback(querySnapshot) : null;
  } catch (e) {
    console.log("Error fetching friend's mellows: ", e);
  }
};

export const onSearchFriends = debounce(async (username, callback) => {
  try {
    const docRef = doc(db, "usernames", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(false);
    }
  } catch (e) {
    console.log("Error searching the username: ", e);
  }
}, 1000);

export const onAddFriends = async (
  userId,
  username,
  pendingFriendsList,
  friendId,
  friendUsername,
  friendRequestList,
  callback
) => {
  try {
    // Adding the friend in Pending map
    const userDocRef = doc(db, "users", userId);
    const usernameDocRef = doc(db, "usernames", username);
    pendingFriendsList.push(friendId);
    await updateDoc(userDocRef, { pendingFriends: pendingFriendsList });
    await updateDoc(usernameDocRef, { pendingFriends: pendingFriendsList });

    const friendUserDocRef = doc(db, "users", friendId);
    const friendUsernameDocRef = doc(db, "usernames", friendUsername);
    friendRequestList.push(userId);
    await updateDoc(friendUserDocRef, { friendRequests: friendRequestList });
    await updateDoc(friendUsernameDocRef, {
      friendRequests: friendRequestList,
    });

    callback();
  } catch (e) {
    console.log("An error occured during adding a friend: ", e);
  }
};

export const onCreateMellowDocs = async (userId, id, userInfos, callback) => {
  const today = new Date();

  try {
    const publicMellowDocRef = await addDoc(collection(db, "mellows"), {
      author: { userInfos },
      authorId: userId,
      id,
      likes: 0,
      comments: [],
      date: today,
    });
    const privateUserInfosRef = doc(db, "users", userId);
    await updateDoc(privateUserInfosRef, { mellow: id });
    callback ? callback() : null;
  } catch (e) {
    alert("Error adding document: ", e);
    console.error("Error adding document: ", e);
  }

  // try {
  //   const privateMellowDocRef = await addDoc(
  //     doc(db, `users/${userId}/mellows`),
  //     {
  //       author: {userInfos},
  //     authorId: userId,
  //       id,
  //       likes: 0,
  //       comments: {},
  //     }
  //   );
  //   callback ? callback() : null;
  // } catch (e) {
  //   alert("Error adding document: ", e);
  //   console.error("Error adding document: ", e);
  // }
};

export const onHandleSignOut = async (fallback) => {
  try {
    await signOut(auth).then((e) => {
      fallback(e);
    });
  } catch (e) {
    console.log(e);
  }
};

export async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(
    getStorage(),
    `/profilePictures/${auth.currentUser?.uid}`
  );
  const result = await uploadBytes(fileRef, blob);

  blob.close();

  return await getDownloadURL(fileRef);
}

const FirebaseContext = createContext(null);

export let firebaseContextValue = {};

export default FirebaseContext;
