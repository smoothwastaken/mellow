import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Viewport } from "@skele/components";
import YoutubePlayer, { getYoutubeMeta } from "react-native-youtube-iframe";
import { CText, CTouchableOpacity } from "../CustomsComponents";

const VA = Viewport.Aware(Image);

const MellowComponent = ({ content }) => {
  const [videoId, setVideoId] = useState(content.id);

  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Video player
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef();

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    } else if (state === "paused") {
      setPlaying(false);
    }
  }, []);

  // VIDEO INFOS
  const [meta, setMeta] = useState({});
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");

  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrame((frame) => frame + 1);
    }, 1);
    return () => {
      clearInterval(frameInterval);
    };
  }, []);

  useEffect(() => {
    console.log(content);
    getYoutubeMeta(videoId).then((meta) => {
      setMeta(meta);
      setCreator(() => {
        let creator = meta?.author_name;
        creator = creator?.toLowerCase();
        if (creator?.endsWith(" - topic")) {
          creator = creator?.slice(0, -" - Topic".length);
        }
        if (creator?.toLowerCase().includes("vevo")) {
          creator = creator?.replace("vevo", "");
        }
        if (creator?.toLowerCase().includes("officiel")) {
          creator = creator?.replace("officiel", "");
        }
        if (creator == "digitaltv") {
          creator = "laylow";
        }
        creator = creator?.replace("  ", " ");
        return creator;
      });
      setTitle(() => {
        let title = meta?.title;
        title = title?.toLowerCase();
        if (title?.includes("- ")) {
          title = title?.slice(title?.indexOf("- ") + 2, title?.length);
        } else if (title?.includes("— ")) {
          title = title?.slice(title?.indexOf("— ") + 2, title?.length);
        }
        if (title?.toLowerCase().includes("avec")) {
          title = title?.replace("avec", "feat.");
        }
        if (title?.toLowerCase().includes("(official video)")) {
          title = title?.replace("(official video)", "");
        }
        if (title?.toLowerCase().includes("(official video remastered)")) {
          title = title?.replace("(official video remastered)", "");
        }
        if (title?.toLowerCase().includes("(official music video)")) {
          title = title?.replace("(official music video)", "");
        }
        if (title?.toLowerCase().includes("(lyric video)")) {
          title = title?.replace("(lyric video)", "");
        }
        if (title?.toLowerCase().includes("(clip officiel)")) {
          title = title?.replace("(clip officiel)", "");
        }
        if (title?.toLowerCase().includes("[clip officiel]")) {
          title = title?.replace("[clip officiel]", "");
        }
        if (title?.toLowerCase().includes("ft.")) {
          title = title?.replace("ft.", "feat.");
        }
        title = title?.replace("  ", " ").trim();
        return title;
      });
    });
  }, [refresh]);

  return (
    <View style={styles.screen}>
      <View style={{ position: "absolute" }}>
        <View>{/* <Image source={}/> */}</View>
        <View
          // style={{
          //   position: "absolute",
          //   zIndex: 100,
          //   backgroundColor: "transparent",
          //   flex: 1,
          //   justifyContent: "center",
          //   alignItems: "center",
          //   width: Dimensions.get("screen").height,
          //   height: Dimensions.get("screen").width,
          //   flexDirection: "row",
          // }}
          style={{
            position: "absolute",
            zIndex: 50,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: "90deg" }],
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            flexDirection: "row",
          }}
        >
          <CTouchableOpacity
            style={{
              backgroundColor: "transparent",
              width: Dimensions.get("window").width / 2,
              height: Dimensions.get("screen").height * 0.5,
            }}
            callback={() => {
              playerRef.current?.getCurrentTime().then((currentTime) => {
                playerRef.current?.seekTo(currentTime - 6);
              });
            }}
            longCallback={() => {
              playerRef.current?.getCurrentTime().then((currentTime) => {
                playerRef.current?.seekTo(currentTime - 22);
              });
            }}
          />
          <CTouchableOpacity
            style={{
              backgroundColor: "transparent",
              width: Dimensions.get("window").width / 2,
              height: Dimensions.get("screen").height * 0.5,
            }}
            callback={() => {
              playerRef.current?.getCurrentTime().then((currentTime) => {
                playerRef.current?.seekTo(currentTime + 5);
              });
            }}
            longCallback={() => {
              playerRef.current?.getCurrentTime().then((currentTime) => {
                playerRef.current?.seekTo(currentTime + 20);
              });
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").height,
            height: Dimensions.get("screen").width,
            marginVertical: Dimensions.get("screen").height / 3.72,
            marginHorizontal: Dimensions.get("screen").width / -1.72,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: "90deg" }],
          }}
        >
          <YoutubePlayer
            height={playing ? Dimensions.get("screen").width : 2}
            width={playing ? Dimensions.get("screen").height : 2}
            play={playing}
            videoId={content.id}
            onChangeState={onStateChange}
            ref={playerRef}
            initialPlayerParams={{
              controls: false,
              modestbranding: false,
              iv_load_policy: 3,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          position: "absolute",
          bottom: Dimensions.get("screen").height * 0.05,
          right: Dimensions.get("screen").width * 0.05,
        }}
      >
        <VA
          onViewportEnter={() => setPlaying(true)}
          onViewportLeave={() => {
            setPlaying(false);
            playerRef.current?.seekTo(0);
          }}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CText fontSize={20}>{title}</CText>
          <CText> • </CText>
          <CText bold>{creator}</CText>
          <View>
            <Image
              source={{ uri: content.author.userInfos.ppURI }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginLeft: 15,
                transform: playing ? [{ rotate: `-${frame}deg` }] : [],
              }}
            />
          </View>
        </View>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    // justifyContent: "center",
    // alignItems: "center",
  },
});

export default MellowComponent;
