import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";

import { EyeIcon, EyeOffIcon } from "react-native-heroicons/outline";

const maxLimitDefault = 20;

const defaultColorText = "white";

function CText({
  children,
  color,
  bold,
  fontSize,
  textAlign,
  difference,
  marginHorizontal,
  marginVertical,
  paddingHorizontal,
  paddingVertical,
  truncate,
}) {
  return (
    <>
      {truncate ? (
        <Text
          style={{
            fontFamily: bold ? "Poppins_700Bold" : "Poppins_600SemiBold",
            letterSpacing: 0.5,
            textAlign: textAlign ? textAlign : "left",
            fontSize: fontSize ? fontSize : 15,
            color: color ? color : defaultColorText,
            marginHorizontal: marginHorizontal ? marginHorizontal : 0,
            marginVertical: marginVertical ? marginVertical : 0,
            paddingHorizontal: paddingHorizontal ? paddingHorizontal : 0,
            paddingVertical: paddingVertical ? paddingVertical : 0,
          }}
          numberOfLines={1}
        >
          {children}
        </Text>
      ) : (
        <Text
          style={{
            fontFamily: bold ? "Poppins_700Bold" : "Poppins_600SemiBold",
            letterSpacing: 0.5,
            textAlign: textAlign ? textAlign : "left",
            fontSize: fontSize ? fontSize : 15,
            color: color ? color : defaultColorText,
            marginHorizontal: marginHorizontal ? marginHorizontal : 0,
            marginVertical: marginVertical ? marginVertical : 0,
            paddingHorizontal: paddingHorizontal ? paddingHorizontal : 0,
            paddingVertical: paddingVertical ? paddingVertical : 0,
          }}
        >
          {children}
        </Text>
      )}
    </>
  );
}

function CTouchableOpacity({
  children,
  style,
  callback,
  longCallback,
  disabled,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={style}
      onPress={() => {
        callback ? callback() : null;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
      onLongPress={() => {
        longCallback ? longCallback() : null;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

function CButton({
  children,
  callback,
  color,
  bgColor,
  width,
  height,
  disabled,
}) {
  return (
    <CTouchableOpacity
      callback={callback}
      disabled={disabled ? disabled : false}
      style={{
        backgroundColor: disabled ? "gray" : bgColor ? `#${bgColor}` : "black",
        borderRadius: 10,
        width: width ? width : 300,
        height: height ? height : 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        marginHorizontal: 25,
        marginVertical: 15,
      }}
    >
      <CText color={color ? color : "white"} fontSize={17} bold>
        {children}
      </CText>
    </CTouchableOpacity>
  );
}

function CInput({
  title,
  type,
  textContentType,
  keyboardType,
  ref,
  onTextChangeCallback,
  editable = true,
  placeholder,
  width,
}) {
  const [display, setDisplay] = useState(false);
  return (
    <View
      style={{
        width: width ? width : Dimensions.get("screen").width - 30,
      }}
    >
      {type === "password" ? (
        <CTouchableOpacity
          style={{ zIndex: 50 }}
          callback={() => {
            setDisplay((display) => !display);
          }}
        >
          {display ? (
            <EyeOffIcon
              style={{ position: "absolute", right: 15, top: 50 }}
              color={"white"}
            />
          ) : (
            <EyeIcon
              style={{ position: "absolute", right: 15, top: 50 }}
              color={"white"}
            />
          )}
        </CTouchableOpacity>
      ) : null}
      <View style={{ marginTop: 5 }}>
        <CText fontSize={20}>{title}:</CText>
      </View>
      <TextInput
        ref={ref}
        autoComplete={type}
        textContentType={textContentType}
        secureTextEntry={type === "password" ? (display ? false : true) : false}
        keyboardType={keyboardType ? keyboardType : "default"}
        autoCorrect={false}
        onChangeText={(text) =>
          onTextChangeCallback ? onTextChangeCallback(text) : null
        }
        editable={editable ? editable : true}
        placeholder={placeholder}
        placeholderTextColor={"grey"}
        style={{
          zIndex: 1,
          backgroundColor: editable ? defaultColorText : "grey",
          color: "black",
          fontSize: 20,
          padding: 15,
          borderRadius: 50,
          marginBottom: 15,
        }}
      />
    </View>
  );
}

function CContainer({
  children,
  width,
  height,
  bgColor,
  borderSize,
  flexDirection,
  marginVertical,
  marginHorizontal,
  paddingVertical,
  paddingHorizontal,
  justifyContent,
}) {
  return (
    <View
      style={{
        marginVertical: marginVertical ? marginVertical : 10,
        marginHorizontal: marginHorizontal ? marginHorizontal : 0,
        paddingVertical: paddingVertical ? paddingVertical : 0,
        paddingHorizontal: paddingHorizontal ? paddingHorizontal : 0,
        backgroundColor: bgColor,
        paddingVertical: 25,
        minWidth: width ? width : 15,
        minHeight: height ? height : 15,
        borderRadius: 50,
        borderColor: "black",
        borderWidth: borderSize ? borderSize : 2,
        borderBottomWidth: borderSize ? borderSize * 2.5 : 10,
        borderRightWidth: borderSize ? borderSize * 2.5 : 10,
        flexDirection: flexDirection ? flexDirection : "row",
        justifyContent: justifyContent ? justifyContent : "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}

export { CText, CTouchableOpacity, CButton, CInput, CContainer };
