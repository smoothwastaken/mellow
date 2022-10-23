import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  CButton,
  CInput,
  CText,
  CTouchableOpacity,
} from "../components/CustomsComponents";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirebaseContext, {
  onCreateUserDocs,
  onFetchUserPrivateInfos,
  onHandleSignOut,
  uploadImageAsync,
} from "../contexts/FirebaseContext";
import {
  ArrowSmLeftIcon,
  CalendarIcon,
  ChevronRightIcon,
  CogIcon,
  CollectionIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  DeviceMobileIcon,
  FlagIcon,
  GlobeIcon,
  MusicNoteIcon,
  PuzzleIcon,
  SpeakerphoneIcon,
  TicketIcon,
} from "react-native-heroicons/outline";
import Tile, {
  TileBottom,
  TileMiddle,
  TileTop,
} from "../components/settingsScreen/TileComponent";

import { useActionSheet } from "@expo/react-native-action-sheet";

import * as Haptics from "expo-haptics";

import * as ImagePicker from "expo-image-picker";
import { getTokens } from "../configs/spotify";
import SpotifyContext from "../contexts/SpotifyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setASItem } from "../configs/asyncStorageMethods";

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Settings"}
      defaultScreenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: "Settings",
          headerTitleStyle: { color: "white" },
          headerTransparent: true,
          headerLeft: () => (
            <CTouchableOpacity callback={() => navigation.goBack()}>
              <ArrowSmLeftIcon size={30} color={"white"} />
            </CTouchableOpacity>
          ),
        })}
      />
      <Stack.Group>
        <Stack.Screen
          name="Edit Profile"
          component={EditProfileScreen}
          options={({ navigation }) => ({
            title: "Edit Profile",
            headerTitleStyle: { color: "white" },
            headerTransparent: true,
            headerLeft: () => (
              <CTouchableOpacity callback={() => navigation.goBack()}>
                <ArrowSmLeftIcon size={30} color={"white"} />
              </CTouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Chose Platform"
          component={PlatformScreen}
          options={({ navigation }) => ({
            title: "Platform",
            headerTitleStyle: { color: "white" },
            headerTransparent: true,
            headerLeft: () => (
              <CTouchableOpacity callback={() => navigation.goBack()}>
                <ArrowSmLeftIcon size={30} color={"white"} />
              </CTouchableOpacity>
            ),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const SettingsScreen = ({ navigation }) => {
  const { currentUser, currentUserInfos } = useContext(FirebaseContext);
  const { setAccessToken, setRefreshToken, setExpirationTime } =
    useContext(SpotifyContext);

  const [backgroundButtonColor, setBackgroundButtonColor] = useState("1A1A1A");

  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: Dimensions.get("screen").height * 0.15,
        }}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              onFetchUserPrivateInfos(currentUser?.uid, (userInfos) => {
                setASItem("@currentUserInfos", userInfos);
              });
            }}
          />
        }
      >
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("screen").height + 10,
          }}
        >
          <CText>hey there</CText>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Tile
            containerStyle={{ flexDirection: "row", alignItems: "center" }}
            callback={() => navigation.navigate("Edit Profile")}
          >
            <Image
              source={{ uri: currentUserInfos?.ppURI }}
              style={{
                height: 60,
                width: 60,
                borderRadius: 50,
                marginRight: 10,
                backgroundColor: "grey",
              }}
            />
            <View>
              <CText marginVertical={2} fontSize={17}>
                {currentUserInfos?.username}
              </CText>
              <CText marginVertical={2} fontSize={11}>
                {currentUserInfos?.name}
              </CText>
            </View>
          </Tile>
        </View>
        <View>
          <Tile title="FEATURES">
            <TicketIcon color={"white"} style={{ marginRight: 10 }} />
            <CText>Mellows</CText>
          </Tile>
        </View>
        <View>
          <TileTop title={"SETTINGS"}>
            <FlagIcon color={"white"} style={{ marginRight: 10 }} />
            <CText>Notifications</CText>
          </TileTop>
          <TileMiddle
            callback={() => {
              // Alert.alert(
              //   "Change platform",
              //   "Select what platform you use for more functionalities.\n\n*Apple Music will be working in the future, but right now it is not working. Wait for an update.",
              //   [
              //     {
              //       text: "Spotify",
              //       style: "default",
              //       onPress: () => {
              //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              //         getTokens();
              //       },
              //     },
              //     {
              //       text: "Apple Music*",
              //       style: "default",
              //       onPress: () => {
              //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              //       },
              //     },
              //     {
              //       text: "Youtube",
              //       style: "default",
              //       onPress: () => {
              //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              //       },
              //     },
              //     {
              //       text: "Cancel",
              //       style: "cancel",
              //       onPress: () => {
              //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              //       },
              //     },
              //   ],
              //   { cancelable: true }
              // );
              const options = ["Spotify", "Apple Music *", "Youtube", "Cancel"];
              const destructiveButtonIndex = 2;
              const cancelButtonIndex = 3;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  destructiveButtonIndex,
                },
                (selectedIndex) => {
                  switch (selectedIndex) {
                    case 0:
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      getTokens();
                      break;

                    case 1:
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      break;

                    case 2:
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      break;

                    case destructiveButtonIndex:
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                      break;

                    case cancelButtonIndex:
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }
              );
            }}
          >
            <DeviceMobileIcon color={"white"} style={{ marginRight: 10 }} />
            <CText>
              Platform:{" "}
              {currentUserInfos?.platform === "ytb"
                ? "Youtube"
                : currentUserInfos?.platform === "spo"
                ? "Spotify"
                : currentUserInfos?.platform === "am"
                ? "Apple Music"
                : null}
            </CText>
          </TileMiddle>
          <TileBottom>
            <CogIcon color={"white"} style={{ marginRight: 10 }} />
            <CText>Other</CText>
          </TileBottom>
        </View>
        <CButton
          bgColor={backgroundButtonColor}
          width={Dimensions.get("screen").width - 30}
          color="red"
          callback={() => {
            Alert.alert("Log Out", "Are you sure that you want log out ?", [
              {
                text: "No",
                style: "cancel",
                onPress: () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                },
              },
              {
                text: "Yes",
                onPress: () =>
                  onHandleSignOut(async () => {
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Heavy
                    );
                    await AsyncStorage.clear();
                    await navigation.navigate("Auth");
                  }),
                style: "destructive",
              },
            ]);
          }}
        >
          Log Out
        </CButton>
      </ScrollView>
    </View>
  );
};
export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, currentUserInfos, setCurrentUserInfos } =
    useContext(FirebaseContext);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [profilePicture, setProfilePicture] = useState();

  useEffect(() => {
    async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: Dimensions.get("screen").height * 0.15,
          justifyContent: "center",
        }}
      >
        <CTouchableOpacity
          style={{ alignItems: "center", marginBottom: 15 }}
          callback={async () => {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
            });

            console.log({ pickerResult });
            setProfilePicture(pickerResult);
          }}
        >
          <Image
            source={{
              uri: profilePicture
                ? profilePicture?.uri
                : currentUserInfos?.ppURI,
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "grey",
            }}
          />
          <CText color={"grey"}>Change profile picture</CText>
        </CTouchableOpacity>
        <CInput
          title="name"
          placeholder={currentUserInfos?.name}
          width={Dimensions.get("screen").width - 40}
        />
        <CInput
          title="username"
          placeholder={currentUserInfos?.username}
          width={Dimensions.get("screen").width - 40}
        />
        <CButton
          callback={async () => {
            try {
              if (!profilePicture.cancelled) {
                setUploadLoading(true);
                let uploadUrl;
                if (!profilePicture) {
                  setProfilePicture(
                    "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg"
                  );
                  uploadUrl =
                    "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg";
                } else {
                  uploadUrl = await uploadImageAsync(profilePicture?.uri);
                }

                console.log(uploadUrl);
                onFetchUserPrivateInfos(currentUser?.uid, (userInfos) =>
                  setCurrentUserInfos(userInfos)
                );
                setUploadLoading(false);
                navigation.goBack();
              }
            } catch (e) {
              console.log(e);
              Alert.alert("Upload failed, sorry :(");
              setUploadLoading(false);
            }
          }}
          bgColor={"fff"}
          color={"black"}
        >
          {!uploadLoading ? "Save" : <ActivityIndicator />}
        </CButton>
      </ScrollView>
    </View>
  );
};

export const PlatformScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: Dimensions.get("screen").height * 0.15,
          justifyContent: "center",
        }}
      ></ScrollView>
    </View>
  );
};

export default SettingsNavigator;
