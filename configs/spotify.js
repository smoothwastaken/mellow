import * as AuthSession from "expo-auth-session";

import { encode as btoa } from "base-64";
import { getASItem, setASItem } from "./asyncStorageMethods";
import SpotifyWebApi from "spotify-web-api-js";

export const spotifyCredentials = {
  clientId: "c31d7eaa8fad44838ca6bd1095c27052",
  clientSecret: "b4277b93dac44187be961428b3817003",
  redirectUri: "https://auth.expo.io/@cleeryy/mellow",
};

const scopesArr = [
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-modify",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-recently-played",
  "user-top-read",
];
const scopes = scopesArr.join(" ");

const getAuthorizationCode = async () => {
  try {
    const credentials = spotifyCredentials; //we wrote this function above
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: "mellow",
    });
    console.log(redirectUrl);
    const result = await AuthSession.startAsync({
      projectNameForProxy: "@cleeryy/mellow",
      returnUrl: redirectUrl,
      authUrl:
        "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        credentials.clientId +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(redirectUrl),
    });
    return result?.params.code;
  } catch (err) {
    console.error(err);
  }
};

export const getTokens = async () => {
  try {
    const authorizationCode = await getAuthorizationCode(); //we wrote this function above
    const credentials = spotifyCredentials; //we wrote this function above (could also run this outside of the functions and store the credentials in local scope)
    const credsB64 = btoa(
      `${credentials.clientId}:${credentials.clientSecret}`
    );
    console.log("getTokens response");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${AuthSession.makeRedirectUri(
        {
          scheme: "mellow",
        }
      )}`,
    });
    const responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    setASItem("@spotifyAccessToken", accessToken);
    setASItem("@spotifyRefreshToken", refreshToken);
    setASItem("@spotifyExpirationTime", expirationTime);
  } catch (err) {
    console.error(err);
  }
};

export const refreshTokens = async (refreshToken) => {
  try {
    const credentials = spotifyCredentials; //we wrote this function above
    const credsB64 = btoa(
      `${credentials.clientId}:${credentials.clientSecret}`
    );
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      console.log("ERROR WITH TOKENS ", responseJson);
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      setASItem("@spotifyAccessToken", newAccessToken);
      if (newRefreshToken) {
        setASItem("@spotifyRefreshToken", newRefreshToken);
      }
      setASItem("@spotifyExpirationTime", expirationTime);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getValidSPObj = async () => {};

export const getUserRecentTracks = async () => {
  getASItem("@spotifyExpirationTime", async (tokenExpirationTime) => {
    if (new Date().getTime() > tokenExpirationTime) {
      // access token has expired, so we need to use the refresh token
      await refreshTokens();
    }
    getASItem("@spotifyAccessToken", async (accessToken) => {
      const sp = new SpotifyWebApi();
      await sp.setAccessToken(accessToken);
      const { items: recentTracks } = await sp.getMyRecentlyPlayedTracks({
        limit: 50,
      });
      setASItem("@spotifyRecentTracks", recentTracks);
    });
  });
};

export const getUserCurrentListening = async () => {
  getASItem("@spotifyExpirationTime", async (tokenExpirationTime) => {
    if (new Date().getTime() > tokenExpirationTime) {
      // access token has expired, so we need to use the refresh token
      await refreshTokens();
    }
    getASItem("@spotifyAccessToken", async (accessToken) => {
      const sp = new SpotifyWebApi();
      await sp.setAccessToken(accessToken);
      const currentPlayingTrack = await sp.getMyCurrentPlayingTrack();
      // console.log(currentPlayingTrack);
      setASItem("@spotifyCurrentPlayingTrack", currentPlayingTrack);
    });
  });
};
