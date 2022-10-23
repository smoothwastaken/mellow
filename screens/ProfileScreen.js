import React, { useContext, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { DotsHorizontalIcon } from "react-native-heroicons/outline";
import { CText, CTouchableOpacity } from "../components/CustomsComponents";
import { getASItem } from "../configs/asyncStorageMethods";
import FirebaseContext from "../contexts/FirebaseContext";

const ProfileScreen = ({ navigation }) => {
  const [currentUserInfos, setCurrentUserInfos] = useState();
  const [accessToken, setAccessToken] = useState();
  useEffect(() => {
    getASItem("@currentUserInfos", (userInfos) =>
      setCurrentUserInfos(userInfos)
    );
    getASItem("@spotifyAccessToken", (storedAccessToken) =>
      setAccessToken(storedAccessToken)
    );
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollview} refreshControl>
        <CTouchableOpacity
          callback={() => {
            navigation.navigate("SettingsNavigator");
          }}
          style={{ flexDirection: "row-reverse" }}
        >
          <DotsHorizontalIcon color={"white"} />
        </CTouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: currentUserInfos?.ppURI }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <CText bold textAlign={"center"} fontSize={25} paddingHorizontal={10}>
            {currentUserInfos?.name}
          </CText>
          <CText textAlign={"center"} fontSize={15} paddingHorizontal={10}>
            {currentUserInfos?.username}
          </CText>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollview: {
    flex: 1,
    paddingTop: 50,
    padding: 10,
  },
});

export default ProfileScreen;
