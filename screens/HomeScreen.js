import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Viewport } from "@skele/components";

import { EmojiSadIcon } from "react-native-heroicons/outline";

import { CButton, CText } from "../components/CustomsComponents";

import FriendsScreen from "./FriendsScreen";
import ProfileScreen from "./ProfileScreen";

import FirebaseContext, {
  onFetchFriendsMellows,
  onFetchUserPrivateInfos,
} from "../contexts/FirebaseContext";

import { getASItem, setASItem } from "../configs/asyncStorageMethods";
import MellowComponent from "../components/homeScreen/MellowComponent";

const Tab = createMaterialTopTabNavigator();

export const HomeNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{ headerShown: false, tabBarBounces: true }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const HomeScreen = ({ navigation }) => {
  const { currentUser } = useContext(FirebaseContext);

  const [currentUserInfos, setCurrentUserInfos] = useState();

  const [friendsMellows, setFriendsMellows] = useState();

  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   onFetchUserPrivateInfos(currentUser?.uid, (userInfos) => {
  //     getASItem("@currentUserInfos", (storedUserInfos) => {
  //       setCurrentUserInfos(storedUserInfos);
  //     });
  //     getASItem("@friendsMellows", (storedFriendsMellows) => {
  //       setFriendsMellows(storedFriendsMellows);
  //     });
  //     setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    setLoading(true);
    onFetchUserPrivateInfos(currentUser?.uid, (userInfos) => {
      setASItem("@currentUserInfos", userInfos);
      setCurrentUserInfos(userInfos);
      onFetchFriendsMellows(userInfos?.friends, (friendsMellows) => {
        let friendsMellowsList = [];
        friendsMellows.forEach((doc) => {
          friendsMellowsList.push(doc);
        });
        setASItem("@friendsMellows", friendsMellowsList);
        setFriendsMellows(friendsMellowsList);
      });
      setLoading(false);
    });
  }, []);

  useEffect(() => {}, []);

  return (
    <View style={styles.screen}>
      {loading ? (
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : null}
      {currentUserInfos?.mellow === "" ? (
        <View
          style={[
            styles.screen,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <CText>you didn't post any mellow..</CText>
          <CButton
            bgColor={"fff"}
            color={"black"}
            callback={() => {
              navigation.navigate("Post Mellow");
            }}
          >
            i'll do it now!
          </CButton>
        </View>
      ) : currentUserInfos?.friends.length !== 0 ||
        friendsMellows !== undefined ? (
        <Viewport.Tracker>
          <FlatList
            data={friendsMellows ? friendsMellows : null}
            renderItem={({ item }) => <MellowComponent content={item.data()} />}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefresh(!refresh);
                }}
              />
            }
          />
        </Viewport.Tracker>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: Dimensions.get("screen").height * 0.2,
          }}
        >
          <EmojiSadIcon size={100} color="white" />
          <CText bold fontSize={20} textAlign={"center"}>
            sorry but i can't find any friends...
          </CText>
          <View style={{ marginVertical: 25 }} />
          <CText>but you can add some friends !</CText>
          <CButton
            bgColor={"fff"}
            color={"black"}
            callback={() => {
              navigation.navigate("Friends");
            }}
          >
            add friends
          </CButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default HomeScreen;
