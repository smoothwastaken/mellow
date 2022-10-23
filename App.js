import { useEffect, useState } from "react";
import { LogBox } from "react-native";

import "react-native-gesture-handler";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "firebase/auth";

import AuthScreen, {
  ProfilePictureScreen,
  SignUpScreen,
  UsernameNameScreen,
} from "./screens/AuthScreen";
import { HomeNavigator } from "./screens/HomeScreen";
import SettingsNavigator from "./screens/SettingsScreen";

import FirebaseContext, {
  firebaseContextValue,
  onFetchUserPrivateInfos,
} from "./contexts/FirebaseContext";
import SpotifyContext, { spotifyContextValue } from "./contexts/SpotifyContext";

import * as Linking from "expo-linking";

import { auth } from "./configs/firebase";
import { setASItem, getASItem } from "./configs/asyncStorageMethods";
import { refreshTokens } from "./configs/spotify";
import PostMellow, { SearchSongs } from "./screens/PostMellow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CText } from "./components/CustomsComponents";
import { AddFriendsScreen } from "./screens/FriendsScreen";

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("app/");

export default function App() {
  // Creating Linking
  const linking = {
    prefixes: [prefix],
  };

  // Firebase Context Values (states)
  const [currentUser, setCurrentUser] = useState();
  const [currentUserInfos, setCurrentUserInfos] = useState();

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      getASItem("@currentUser", (currentUser) => {
        setCurrentUser(currentUser);
        onFetchUserPrivateInfos(currentUser?.uid, (userInfos) => {
          setASItem("@currentUserInfos", userInfos);
          setCurrentUserInfos(userInfos);
        });
      });
    } else {
      onFetchUserPrivateInfos(auth.currentUser?.uid, (userInfos) => {
        setASItem("@currentUserInfos", userInfos);
        setCurrentUserInfos(userInfos);
      });
    }
  }, []);

  onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  useEffect(() => {
    if (currentUser?.uid) {
      setASItem("@currentUser", currentUser);
      onFetchUserPrivateInfos(currentUser?.uid, (userInfos) => {
        setASItem("@currentUserInfos", userInfos);
        setCurrentUserInfos(userInfos);
      });
    }
  }, [currentUser]);

  firebaseContextValue.currentUser = currentUser;
  firebaseContextValue.setCurrentUser = setCurrentUser;
  firebaseContextValue.currentUserInfos = currentUserInfos;
  firebaseContextValue.setCurrentUserInfos = setCurrentUserInfos;

  // Spotify Context Values (states)

  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expirationTime, setExpirationTime] = useState();

  useEffect(() => {
    if (currentUserInfos?.platform == "spo") {
      const refreshingTokens = async () => {
        console.log("trying to refresh tokens");
        if (!expirationTime || new Date().getTime() > expirationTime) {
          getASItem("@spotifyRefreshToken", async (storedRefreshToken) => {
            await refreshTokens(storedRefreshToken);
          });
          console.log("refreshing tokens");
        }
      };

      refreshingTokens();

      getASItem("@spotifyAccessToken", (storedAccessToken) => {
        if (storedAccessToken) {
          getASItem("@spotifyAccessToken", (storedAccessToken) =>
            setAccessToken(storedAccessToken)
          );
          getASItem("@spotifyRefreshToken", (storedRefreshToken) =>
            setRefreshToken(storedRefreshToken)
          );
          getASItem("@spotifyExpirationTime", (storedExpirationTime) =>
            setExpirationTime(storedExpirationTime)
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    if (currentUserInfos?.platform == "spo") {
      if (accessToken && refreshToken && expirationTime) {
        setASItem("@spotifyAccessToken", accessToken);
        setASItem("@spotifyRefreshToken", refreshToken);
        setASItem("@spotifyExpirationTime", expirationTime);
      }
    }
  }, [accessToken, refreshToken, expirationTime]);

  if (currentUserInfos?.platform == "spo") {
    spotifyContextValue.accessToken = accessToken;
    spotifyContextValue.setAccessToken = setAccessToken;
    spotifyContextValue.refreshToken = refreshToken;
    spotifyContextValue.setRefreshToken = setRefreshToken;
    spotifyContextValue.expirationTime = expirationTime;
    spotifyContextValue.setExpirationTime = setExpirationTime;
  }

  useEffect(() => {
    setASItem("@youtubeApiKey", "AIzaSyB06EK2O9MICxYovHs0r3SSP9rHq-j3i60");
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ActionSheetProvider>
      <NavigationContainer
        linking={linking}
        fallback={<CText>Loading...</CText>}
      >
        <StatusBar style="light" />
        <FirebaseContext.Provider value={firebaseContextValue}>
          <SpotifyContext.Provider value={spotifyContextValue}>
            <Stack.Navigator
              initialRouteName={
                getASItem("@currentUser") ? "HomeNavigator" : "Auth"
              }
            >
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="HomeNavigator"
                component={HomeNavigator}
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="SettingsNavigator"
                component={SettingsNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Join Us" component={SignUpScreen} />
                <Stack.Screen
                  name="UsernameNameScreen"
                  component={UsernameNameScreen}
                />
                <Stack.Screen
                  name="ProfilePictureScreen"
                  component={ProfilePictureScreen}
                />
              </Stack.Group>
              <Stack.Group
                screenOptions={{ presentation: "modal", headerShown: false }}
              >
                <Stack.Screen name="Post Mellow" component={PostMellow} />
                <Stack.Screen name="Search Songs" component={SearchSongs} />
              </Stack.Group>
              <Stack.Group
                screenOptions={{ presentation: "modal", headerShown: false }}
              >
                <Stack.Screen name="Add Friends" component={AddFriendsScreen} />
              </Stack.Group>
            </Stack.Navigator>
          </SpotifyContext.Provider>
        </FirebaseContext.Provider>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
