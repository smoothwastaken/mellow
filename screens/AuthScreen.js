import React, { useContext, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  CButton,
  CContainer,
  CInput,
  CText,
  CTouchableOpacity,
} from "../components/CustomsComponents";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

const AuthScreen = ({ navigation }) => {
  const { currentUser, currentUserInfos } = useContext(FirebaseContext);

  onAuthStateChanged(auth, (user) => {
    onFetchUserPrivateInfos(user?.uid, (userInfos) => {
      if (user?.uid) {
        if (userInfos) {
          navigation.navigate("HomeNavigator");
        } else {
          navigation.navigate("UsernameNameScreen");
        }
      }
    });
  });

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <CContainer bgColor={"white"} borderSize={0}>
          <CText bold color={"black"} fontSize={50} paddingHorizontal={30}>
            mellow
          </CText>
        </CContainer>
        <CText>keep your songs updated.</CText>
      </View>

      <View style={styles.bottom}>
        <CText>don't be late !</CText>
        <View>
          <CButton
            bgColor={"fff"}
            color={"black"}
            callback={() => {
              if (currentUser?.uid) {
                if (currentUserInfos?.username) {
                  navigation.navigate("HomeNavigator");
                } else {
                  navigation.navigate("UsernameNameScreen");
                }
              } else {
                navigation.navigate("Join Us");
              }
            }}
          >
            join us 👀
          </CButton>
        </View>
      </View>
    </View>
  );
};

import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import {
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { firebaseConfig, auth } from "../configs/firebase";
import FirebaseContext, {
  onCreateUserDocs,
  onFetchUserPrivateInfos,
  uploadImageAsync,
} from "../contexts/FirebaseContext";

export const SignUpScreen = ({ navigation }) => {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationId, setVerificationId] = React.useState("");
  const [verifyError, setVerifyError] = React.useState();
  const [verifyInProgress, setVerifyInProgress] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [confirmError, setConfirmError] = React.useState();
  const [confirmInProgress, setConfirmInProgress] = React.useState(false);

  return (
    <ScrollView
      style={{ backgroundColor: "black" }}
      contentContainerStyle={styles.screen}
    >
      <CTouchableOpacity
        style={{ position: "absolute", top: 70, left: 10, margin: 5 }}
        callback={() => {
          navigation.goBack();
        }}
      >
        <ChevronLeftIcon size={30} color={"white"} />
      </CTouchableOpacity>
      <View style={{ flex: 1, justifyContent: "space-evenly" }}>
        <CText textAlign={"center"} bold fontSize={30}>
          What's your number ?
        </CText>
        <View style={styles.container}>
          {!verificationId ? (
            <>
              <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
              />
              <CInput
                title={"Enter phone number"}
                editable={!verificationId}
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
                placeholder="+1 999 999 9999"
                onTextChangeCallback={(phoneNumber) => {
                  setPhoneNumber(phoneNumber);
                }}
              />
              <CButton
                color={"black"}
                bgColor={"fff"}
                disabled={!phoneNumber}
                callback={async () => {
                  console.log("onpress () function fired", phoneNumber);
                  const phoneProvider = new PhoneAuthProvider(auth);
                  try {
                    setVerifyError(undefined);
                    setVerifyInProgress(true);
                    setVerificationId("");
                    const verificationId =
                      await phoneProvider.verifyPhoneNumber(
                        phoneNumber,
                        recaptchaVerifier.current
                      );
                    setVerifyInProgress(false);
                    setVerificationId(verificationId);
                    Alert.alert(
                      "A verification code has been sent to your phone"
                    );
                  } catch (err) {
                    setVerifyError(err);
                    setVerifyInProgress(false);
                  }
                }}
              >{`${
                verificationId ? "Resend" : "Send"
              } Verification Code`}</CButton>
              {verifyError && (
                <CText color={"red"}>{`Error: ${verifyError.message}`}</CText>
              )}
              {verifyInProgress && <ActivityIndicator style={styles.loader} />}
              {verificationId ? (
                <CText color={"green"}>
                  A verification code has been sent to your phone
                </CText>
              ) : undefined}
            </>
          ) : null}
          {verificationId ? (
            <>
              <CInput
                editable={!!verificationId}
                title={"Enter verification code"}
                keyboardType="phone-pad"
                placeholder="123456"
                onTextChangeCallback={(verificationCode) =>
                  setVerificationCode(verificationCode)
                }
              />
              <CButton
                bgColor={"fff"}
                color={"black"}
                disabled={!verificationCode}
                callback={async () => {
                  try {
                    setConfirmError(undefined);
                    setConfirmInProgress(true);
                    const credential = PhoneAuthProvider.credential(
                      verificationId,
                      verificationCode
                    );
                    const authResult = await signInWithCredential(
                      auth,
                      credential
                    );
                    setConfirmInProgress(false);
                    setVerificationId("");
                    setVerificationCode("");
                    Alert.alert("Phone authentication successful!");
                    navigation.navigate("UsernameNameScreen");
                  } catch (err) {
                    Alert.alert(err);
                    console.log(err);
                    setConfirmError(err);
                    setConfirmInProgress(false);
                  }
                }}
              >
                Confirm Verification Code
              </CButton>
            </>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export const UsernameNameScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  return (
    <ScrollView
      style={{ backgroundColor: "black" }}
      contentContainerStyle={styles.screen}
    >
      <CTouchableOpacity
        style={{ position: "absolute", top: 70, left: 10, margin: 5 }}
        callback={() => {
          navigation.goBack();
        }}
      >
        <ChevronLeftIcon size={30} color={"white"} />
      </CTouchableOpacity>
      <View style={{ flex: 1, justifyContent: "space-evenly" }}>
        <CText textAlign={"center"} bold fontSize={30}>
          Tell us how can we call you ?
        </CText>
        <View>
          <CInput
            title={"name"}
            editable={true}
            placeholder={"name"}
            onTextChangeCallback={(text) => setName(text)}
          />
          <CInput
            title={"username"}
            editable={true}
            placeholder={"username"}
            onTextChangeCallback={(text) => setUsername(text)}
          />
          <CButton
            callback={() => {
              navigation.navigate("ProfilePictureScreen", { name, username });
            }}
            bgColor={"fff"}
            color={"black"}
            disabled={username && name ? false : true}
          >
            {name === "" ? "Hmm.. Still thinking." : `I'm ${name} !`}
          </CButton>
        </View>
      </View>
    </ScrollView>
  );
};

export const ProfilePictureScreen = ({ route, navigation }) => {
  const { name, username } = route.params;

  const [uploadLoading, setUploadLoading] = useState(false);

  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    imagePickerFunction = async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
  }, []);

  useEffect(() => {
    console.log(profilePicture);
  }, [profilePicture]);

  return (
    <ScrollView
      style={{ backgroundColor: "black" }}
      contentContainerStyle={styles.screen}
    >
      <CTouchableOpacity
        style={{ position: "absolute", top: 70, left: 10, margin: 5 }}
        callback={() => {
          navigation.goBack();
        }}
      >
        <ChevronLeftIcon size={30} color={"white"} />
      </CTouchableOpacity>
      <View style={{ flex: 1, justifyContent: "space-evenly" }}>
        <CText textAlign={"center"} bold fontSize={30}>
          What do you look like {name} ?
        </CText>
        <View style={{ alignItems: "center" }}>
          <CTouchableOpacity
            style={{ alignItems: "center" }}
            callback={async () => {
              let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
              });

              console.log({ pickerResult });

              setProfilePicture(pickerResult);
            }}
          >
            <CText bold fontSize={13} marginVertical={10}>
              (Click to change your profile picture)
            </CText>
            <Image
              source={{
                uri:
                  profilePicture === ""
                    ? "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg"
                    : profilePicture?.uri,
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
              }}
            />
          </CTouchableOpacity>
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
                  onCreateUserDocs(
                    auth.currentUser?.uid,
                    name,
                    username,
                    uploadUrl
                  );
                  navigation.navigate("HomeNavigator");
                }
              } catch (e) {
                console.log(e);
                alert("Upload failed, sorry :(");
                setUploadLoading(false);
              }
            }}
            bgColor={"fff"}
            color={"black"}
          >
            {!uploadLoading ? (
              profilePicture ? (
                "Like this !"
              ) : (
                "I'll show you later..."
              )
            ) : (
              <ActivityIndicator />
            )}
          </CButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
  },

  top: {
    alignItems: "center",
  },
  bottom: {
    alignItems: "center",
  },
});

export default AuthScreen;
