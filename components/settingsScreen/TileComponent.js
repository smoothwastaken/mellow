import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { CTouchableOpacity } from "../CustomsComponents";

const Tile = ({ children, title, containerStyle, bgColor, callback }) => {
  const [backgroundButtonColor, setBackgroundButtonColor] = useState(
    bgColor ? bgColor : "1A1A1A"
  );

  return (
    <>
      {title ? (
        <Text
          style={{
            color: "grey",
            fontWeight: "400",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
      ) : null}
      <CTouchableOpacity
        callback={callback}
        style={{
          padding: 15,
          marginBottom: 20,
          width: Dimensions.get("screen").width - 20,
          backgroundColor: `#${backgroundButtonColor}`,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={
            containerStyle
              ? containerStyle
              : { flexDirection: "row", alignItems: "center" }
          }
        >
          {children}
        </View>
        <ChevronRightIcon color={"grey"} size={15} />
      </CTouchableOpacity>
    </>
  );
};

export const TileTop = ({
  children,
  title,
  containerStyle,
  bgColor,
  callback,
}) => {
  const [backgroundButtonColor, setBackgroundButtonColor] = useState(
    bgColor ? bgColor : "1A1A1A"
  );

  return (
    <>
      {title ? (
        <Text
          style={{
            color: "grey",
            fontWeight: "400",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
      ) : null}
      <CTouchableOpacity
        callback={callback}
        style={{
          padding: 15,
          width: Dimensions.get("screen").width - 20,
          backgroundColor: `#${backgroundButtonColor}`,
          borderBottomColor: "#202020",
          borderBottomWidth: 1,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={
            containerStyle
              ? containerStyle
              : { flexDirection: "row", alignItems: "center" }
          }
        >
          {children}
        </View>
        <ChevronRightIcon color={"grey"} size={15} />
      </CTouchableOpacity>
    </>
  );
};

export const TileBottom = ({ children, containerStyle, bgColor, callback }) => {
  const [backgroundButtonColor, setBackgroundButtonColor] = useState(
    bgColor ? bgColor : "1A1A1A"
  );

  return (
    <CTouchableOpacity
      callback={callback}
      style={{
        padding: 15,
        width: Dimensions.get("screen").width - 20,
        backgroundColor: `#${backgroundButtonColor}`,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={
          containerStyle
            ? containerStyle
            : { flexDirection: "row", alignItems: "center" }
        }
      >
        {children}
      </View>
      <ChevronRightIcon color={"grey"} size={15} />
    </CTouchableOpacity>
  );
};

export const TileMiddle = ({ children, containerStyle, bgColor, callback }) => {
  const [backgroundButtonColor, setBackgroundButtonColor] = useState(
    bgColor ? bgColor : "1A1A1A"
  );

  return (
    <CTouchableOpacity
      callback={callback}
      style={{
        padding: 15,
        width: Dimensions.get("screen").width - 20,
        backgroundColor: `#${backgroundButtonColor}`,
        borderBottomColor: "#202020",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={
          containerStyle
            ? containerStyle
            : { flexDirection: "row", alignItems: "center" }
        }
      >
        {children}
      </View>
      <ChevronRightIcon color={"grey"} size={15} />
    </CTouchableOpacity>
  );
};

export default Tile;
