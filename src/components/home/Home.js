import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
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
            const redirect_uri = 'http://localhost:3000';

            const state = generateRandomString(16);

            localStorage.setItem("stateKey", JSON.stringify(state));
            const scope = 'user-read-private user-read-email';

            let url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);

            _authorizeSpotify(url);            
        }

        spotifyOauth();
    }, []);

    const _authorizeSpotify = async (url) => {
        try {
            const res = await axios.post(url);

            console.log(res);
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    const _createGuestUser = async () => {
        try {
            const res = await axios.post(`${apiHostUrl}/api/guest`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setAuth(res.data);
            saveAuth(res.data);

            _createRoom(res.data.id);

        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
        
    }

    const _joinRoom = async () => {
        try {
            const res = await axios.post(`${apiHostUrl}/api/guest`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setAuth(res.data);
            saveAuth(res.data);

            navigate(`/room/search`);

        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    const _createRoom = async (host) => {

        try {
            const res = await axios.post(`${apiHostUrl}/api/rooms/new/host/id/${host}`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            navigate(`/room/${res.data.id}`);

        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    const onCreateRoomClick = () => {
        _createGuestUser();
    }

    const onCreateGuestClick = () => {
        _joinRoom();
        //navigate to join room page
    }

    return(
        <Container style={{minHeight: '0em'}}>
            <h1>Home</h1>

            <Container style={{minHeight: '0em', flexDirection: 'row', paddingTop: '10vh', justifyContent: 'center'}}>
                <Button 
                    style={{width: '25%'}}
                    onClick={onCreateRoomClick}
                    >Create Room</Button>
                <Button 
                    style={{width: '25%'}}
                    onClick={onCreateGuestClick}
                    >Join Room</Button>
            </Container>
        </Container>
    );
}

export default Home;