import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  PlusIcon,
  PlusSmIcon,
  SearchIcon,
} from "react-native-heroicons/outline";
import { CText, CTouchableOpacity } from "../components/CustomsComponents";
import { getASItem, setASItem } from "../configs/asyncStorageMethods";
import FirebaseContext, {
  onAddFriends,
  onFetchUserPrivateInfos,
  onFetchUserPublicInfos,
  onSearchFriends,
} from "../contexts/FirebaseContext";

const FriendsScreen = ({ navigation }) => {
  const authContext = useContext(FirebaseContext);

  const [currentUserInfos, setCurrentUserInfos] = useState();

  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getASItem("@currentUserInfos", (storedUserInfos) => {
      setCurrentUserInfos(storedUserInfos);
    });
  }, []);

  useEffect(() => {
    setCurrentUserInfos(authContext.currentUserInfos);
  }, [refresh]);

  return (
    <SafeAreaView style={styles.screen}>
      {currentUserInfos == undefined ? (
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : null}
      <View
        style={{
          margin: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CText bold fontSize={35}>
          friends
        </CText>
        <CTouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#3DC757",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderRadius: 50,
          }}
          callback={() => {
            navigation.navigate("Add Friends");
          }}
        >
          <PlusIcon color={"white"} style={{ marginRight: 5 }} />
          <CText>add friends</CText>
        </CTouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {currentUserInfos?.pendingFriends ? (
          <>
            <View>
              <Text
                style={{
                  color: "grey",
                  fontWeight: "400",
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                PENDING FRIENDS
              </Text>
            </View>
            <FlatList
              data={currentUserInfos?.pendingFriends}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefresh(!refresh);
                  }}
                />
              }
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderRadius: 15,
                    borderColor: "gray",
                    width: Dimensions.get("screen").width * 0.9,
                    height: Dimensions.get("screen").height * 0.12,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: currentUserInfos?.ppURI }}
                      style={{
                        borderRadius: 50,
                        width: Dimensions.get("screen").height * 0.09,
                        height: Dimensions.get("screen").height * 0.09,
                      }}
                    />
                    <View style={{ marginLeft: 15 }}>
                      <CText fontSize={20}>{item}</CText>
                      <CText color={"gray"} bold>
                        {currentUserInfos?.username}
                      </CText>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#3A3A3A",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 50,
                    }}
                  >
                    <CText bold>PENDING</CText>
                  </View>
                </View>
              )}
            />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export const AddFriendsScreen = ({ navigation }) => {
  const { currentUser, currentUserInfos } = useContext(FirebaseContext);

  const [friendExists, setFriendExists] = useState(false);
  const [friendInfos, setFriendInfo] = useState();

  useEffect(() => {
    onFetchUserPrivateInfos(currentUser?.uid, (userInfos) => {
      setASItem("@currentUserInfos", userInfos);
    });
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ marginVertical: 15 }}>
        <CText textAlign={"center"} fontSize={25} bold>
          search a friend
        </CText>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          onChangeText={(text) => {
            text.length > 3
              ? text.toLowerCase().replace(" ", "") ==
                currentUserInfos?.username
                ? null
                : onSearchFriends(
                    text.toLowerCase().replace(" ", ""),
                    (fetchedFriend) => {
                      if (fetchedFriend) {
                        setFriendExists(true);
                        setFriendInfo(fetchedFriend);
                      } else {
                        setFriendExists(false);
                        setFriendInfo(undefined);
                      }
                    }
                  )
              : null;
          }}
          autoCorrect={false}
          textContentType={"username"}
          style={{
            backgroundColor: "gray",
            marginRight: 10,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 15,
            width: Dimensions.get("screen").width * 0.9,
            fontSize: 20,
            color: "white",
          }}
        />
        <SearchIcon color={"white"} size={25} />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        {friendExists ? (
          <View
            style={{
              flexDirection: "row",
              borderRadius: 15,
              borderColor: "gray",
              width: Dimensions.get("screen").width * 0.9,
              height: Dimensions.get("screen").height * 0.12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: friendInfos?.ppURI }}
                style={{
                  borderRadius: 50,
                  width: Dimensions.get("screen").height * 0.09,
                  height: Dimensions.get("screen").height * 0.09,
                }}
              />
              <View style={{ marginLeft: 15 }}>
                <CText fontSize={20}>{friendInfos?.name}</CText>
                <CText color={"gray"} bold>
                  {friendInfos?.username}
                </CText>
              </View>
            </View>
            {currentUserInfos?.friends?.includes(friendInfos?.uid) ? (
              <View
                style={{
                  backgroundColor: "#3A3A3A",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 50,
                }}
              >
                <CText bold>ADDED</CText>
              </View>
            ) : (
              <CTouchableOpacity
                style={{ marginRight: 10, padding: 20 }}
                callback={() => {
                  console.log(currentUserInfos?.friends?.join(" "));
                  onAddFriends(
                    currentUser?.uid,
                    currentUserInfos?.username,
                    currentUserInfos?.friends,
                    friendInfos?.uid,
                    friendInfos?.username,
                    friendInfos?.friendRequests,
                    () => {
                      Alert.alert("hey you", "friend request sent ;)");
                      navigation.goBack();
                    }
                  );
                }}
              >
                <PlusSmIcon color={"white"} size={30} />
              </CTouchableOpacity>
            )}
          </View>
        ) : (
          <View>
            <CText>sorry, but i can't find your friend...</CText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default FriendsScreen;
