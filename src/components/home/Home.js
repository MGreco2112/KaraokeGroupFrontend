import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import { apiHostUrl, loginToken } from "../config";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { spotifyClientId } from "../config";
import { generateRandomString } from "../SpotifyComponents/SpotifyComponents";
import Container from "../common/Container";
import Button from "../common/Button";

const Home = () => {
  const [auth, setAuth, saveAuth, deleteAuth] = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const spotifyOauth = () => {
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

    if (localStorage.getItem("stateKey") === null) {
        console.log(true);
        spotifyOauth();
    }
  }, []);

  const handleAuthorizationCallback = (state) => {
    const hashParams = queryString.parse(window.location.hash);

    if (hashParams.access_token) {
      // Handle successful authorization
      const accessToken = hashParams.access_token;
      // Use the access token for subsequent API calls
      _fetchUserProfile(accessToken);
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

  const _createGuestUser = async () => {
    try {
      const res = await axios.post(
        `${apiHostUrl}/api/guest`,
        {},
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );

      setAuth(res.data);
      saveAuth(res.data);

      _createRoom(res.data.id);
    } catch (err) {
      console.error(err.message ? err.message : err.response);
    }
  };

  const _joinRoom = async () => {
    try {
      const res = await axios.post(
        `${apiHostUrl}/api/guest`,
        {},
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );

      setAuth(res.data);
      saveAuth(res.data);

      navigate(`/room/search`);
    } catch (err) {
      console.error(err.message ? err.message : err.response);
    }
  };

  const _createRoom = async (host) => {
    try {
      const res = await axios.post(
        `${apiHostUrl}/api/rooms/new/host/id/${host}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );

      navigate(`/room/${res.data.id}`);
    } catch (err) {
      console.error(err.message ? err.message : err.response);
    }
  };

  const onCreateRoomClick = () => {
    _createGuestUser();
  };

  const onCreateGuestClick = () => {
    _joinRoom();
    //navigate to join room page
  };

  return (
    <Container style={{ minHeight: "0em" }}>
      <h1>Home</h1>

      <Container
        style={{
          minHeight: "0em",
          flexDirection: "row",
          paddingTop: "10vh",
          justifyContent: "center",
        }}
      >
        <Button style={{ width: "25%" }} onClick={onCreateRoomClick}>
          Create Room
        </Button>
        <Button style={{ width: "25%" }} onClick={onCreateGuestClick}>
          Join Room
        </Button>
      </Container>
    </Container>
  );
};

export default Home;