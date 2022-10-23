import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
// import Animated, {
//   useSharedValue,
//   withTiming,
//   useAnimatedStyle,
//   Easing,
// } from "react-native-reanimated";
import {
  CInput,
  CText,
  CTouchableOpacity,
} from "../components/CustomsComponents";
import { getASItem } from "../configs/asyncStorageMethods";
import {
  getUserCurrentListening,
  getUserRecentTracks,
} from "../configs/spotify";
import { FlatList } from "react-native-gesture-handler";

import YTSearch from "youtube-api-search";
import { SearchIcon } from "react-native-heroicons/outline";
import FirebaseContext, {
  onCreateMellowDocs,
} from "../contexts/FirebaseContext";

function secondsToHms(d) {
  d = Number(d);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  return `${m}:${s}`;
}

const PostMellow = ({ navigation }) => {
  const { currentUser, currentUserInfos } = useContext(FirebaseContext);

  const [accessToken, setAccessToken] = useState();
  const [youtubeApiKey, setYoutubeApiKey] = useState();
  const [recentTracks, setRecentTracks] = useState();
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState();
  useEffect(() => {
    if (currentUserInfos?.platform == "spo") {
      getASItem("@spotifyAccessToken", (storedAccessToken) =>
        setAccessToken(storedAccessToken)
      );
    }
    getASItem("@youtubeApiKey", (storedYoutubeApiKey) => {
      setYoutubeApiKey(storedYoutubeApiKey);
    });
    if (currentUserInfos?.platform == "spo") {
      getUserRecentTracks();
      getASItem("@spotifyRecentTracks", (storedRecentTracks) => {
        setRecentTracks(storedRecentTracks);
      });
      getUserCurrentListening();
      getASItem("@spotifyCurrentPlayingTrack", (storedCurrentPlayingTrack) => {
        setCurrentPlayingTrack(storedCurrentPlayingTrack.item);
      });
      setInterval(() => {
        getASItem("@spotifyAccessToken", (storedAccessToken) =>
          setAccessToken(storedAccessToken)
        );
        getASItem("@youtubeApiKey", (storedYoutubeApiKey) => {
          setYoutubeApiKey(storedYoutubeApiKey);
        });
        getUserRecentTracks();
        getASItem("@spotifyRecentTracks", (storedRecentTracks) => {
          setRecentTracks(storedRecentTracks);
        });
        getUserCurrentListening();
        getASItem(
          "@spotifyCurrentPlayingTrack",
          (storedCurrentPlayingTrack) => {
            setCurrentPlayingTrack(storedCurrentPlayingTrack.item);
          }
        );
      }, 5000);

      return clearInterval(0);
    }
  }, []);

  return (
    <View style={styles.screen}>
      <CTouchableOpacity
        style={{
          flex: 1,
          zIndex: 15,
          flexDirection: "row",
          backgroundColor: "white",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          bottom: Dimensions.get("screen").height * 0.075,
          left: Dimensions.get("screen").width * 0.25,
          width: Dimensions.get("screen").width * 0.5,
          height: Dimensions.get("screen").height * 0.06,
        }}
        callback={() => {
          navigation.navigate("Search Songs");
        }}
      >
        <SearchIcon style={{ right: 5 }} color={"black"} />
        <CText textAlign={"center"} color={"black"} bold>
          search a song
        </CText>
      </CTouchableOpacity>
      <CText textAlign={"center"} fontSize={25} bold>
        post a mellow
      </CText>
      <ScrollView>
        {currentPlayingTrack ? (
          <View
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View style={{ marginTop: 15 }}>
              <CText>Current playing track</CText>
            </View>
            <CTouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                paddingVertical: 10,

                height: Dimensions.get("screen").height * 0.22,
                width: Dimensions.get("screen").width * 0.9,
              }}
              callback={() => {
                YTSearch(
                  {
                    key: youtubeApiKey,
                    term: `${currentPlayingTrack.name} ${currentPlayingTrack.artists[0].name}`,
                    maxResults: 1,
                  },
                  (videos) => {
                    const videoId = videos[0].id.videoId;
                    onCreateMellowDocs(
                      currentUser?.uid,
                      videoId,
                      currentUserInfos,
                      () => {
                        Alert.alert("MELLOW POSTED");
                      }
                    );
                  }
                );
                navigation.goBack();
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{
                    uri: currentPlayingTrack.album.images[0].url,
                  }}
                  style={{
                    marginLeft: 10,
                    marginRight: 20,
                    width: Dimensions.get("screen").height * 0.2,
                    height: Dimensions.get("screen").height * 0.2,
                    borderRadius: 15,
                  }}
                />
                <View
                  style={{
                    paddingRight: 10,
                    width: Dimensions.get("screen").width * 0.375,
                  }}
                >
                  <CText truncate textAlign={"left"} bold>
                    {currentPlayingTrack.name}
                  </CText>
                  <CText truncate fontSize={13}>
                    {currentPlayingTrack.artists[0].name}
                  </CText>
                  <CText>
                    {secondsToHms(currentPlayingTrack.duration_ms / 1000)}
                  </CText>
                  <View
                    style={{
                      marginTop: 15,
                      // width: Dimensions.get("screen").width * 0.35,
                    }}
                  >
                    <CText truncate fontSize={13}>
                      {currentPlayingTrack.album.name}
                    </CText>
                    <CText truncate fontSize={13}>
                      {currentPlayingTrack.album.release_date}
                    </CText>
                  </View>
                </View>
              </View>
            </CTouchableOpacity>
          </View>
        ) : null}
        {currentUserInfos?.platform == "spo" ? (
          <View style={{ marginTop: 25 }}>
            <CText>Your recent Spotify's songs</CText>
          </View>
        ) : null}
        <View style={styles.container}>
          {accessToken ? (
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={recentTracks}
                renderItem={({ item }) => (
                  <CTouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "grey",
                      paddingRight: 10,
                      height: Dimensions.get("screen").height * 0.1,
                    }}
                    callback={() => {
                      YTSearch(
                        {
                          key: youtubeApiKey,
                          term: `${item.track.name} ${item.track.artists[0].name}`,
                          maxResults: 1,
                        },
                        (videos) => {
                          const videoId = videos[0].id.videoId;
                          onCreateMellowDocs(
                            currentUser?.uid,
                            videoId,
                            currentUserInfos,
                            () => {
                              Alert.alert("MELLOW POSTED");
                            }
                          );
                        }
                      );
                      navigation.goBack();
                    }}
                  >
                    <Image
                      source={{ uri: item.track.album.images[0].url }}
                      style={{
                        marginRight: 20,
                        width: Dimensions.get("screen").height * 0.099,
                        height: Dimensions.get("screen").height * 0.099,
                      }}
                    />
                    <View>
                      <CText bold>{item.track.name}</CText>
                      <CText fontSize={13}>{item.track.artists[0].name}</CText>
                    </View>
                  </CTouchableOpacity>
                )}
              />
            </View>
          ) : (
            <View>
              <View style={{ marginTop: 25 }}>
                <CText>Post a mellow with Youtube</CText>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export const SearchSongs = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <CText textAlign={"center"} fontSize={25} bold>
        search a mellow
      </CText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    backgroundColor: "black",
  },
  title: {
    justifyContent: "center",
  },
});

export default PostMellow;
