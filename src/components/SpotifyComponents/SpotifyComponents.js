import { spotifyClientId } from "../config";
import queryString from "query-string";
import axios from "axios";

//generate random string for hashing
export const generateRandomString = (length) => {
    let text = '';

    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export const generateCodeChallenge = async (codeVerifier) => {
    const base64encode = (string) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}

export const spotifyOauth = () => {
    const client_id = spotifyClientId;
    const redirect_uri = "http://localhost:3000";
    const state = generateRandomString(16);
    const scope = "user-read-private user-read-email";

    const queryParams = queryString.stringify({
      response_type: "token",
      client_id,
      redirect_uri,
      state,
      scope,
    });

    const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
    window.location.href = authUrl;
    handleAuthorizationCallback(state);
};

export const spotifyOauthRoom = (id) => {
    const client_id = spotifyClientId;
    const redirect_uri =`http://localhost:3000/room/${id}`;
    const state = generateRandomString(16);
    const scope = "user-read-private user-read-email";

    const queryParams = queryString.stringify({
      response_type: "token",
      client_id,
      redirect_uri,
      state,
      scope,
  });

  const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
  window.location.href = authUrl;
  handleAuthorizationCallback(state);
}

const handleAuthorizationCallback = (state) => {
    const hashParams = queryString.parse(window.location.hash);

    if (hashParams.access_token) {
      // Handle successful authorization
      const accessToken = hashParams.access_token;
      //store spotify access token in local storage item
      localStorage.setItem("spotifyToken", accessToken);
      // Use the access token for subsequent API calls
      _fetchUserProfile(accessToken);
      //store state key in local storage
      localStorage.setItem("stateKey", state);
    } else {
      // Handle authorization error
      const error = hashParams.error;
      console.error("Authorization Error:", error);
    }
};

const _fetchUserProfile = async (accessToken) => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("User Profile:", res.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
};


