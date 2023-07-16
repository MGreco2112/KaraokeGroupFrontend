import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiHostUrl, loginToken, spotifySearchUrl } from "../config";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { spotifyOauth } from "../SpotifyComponents/SpotifyComponents";
import Guest from "../guest/Guest";
import Song from "./Song";
import Button from "../common/Button";
import Container from "../common/Container";
import Input from "../common/Input";
import InlineInputContainer from "../common/InlineInputContainer";

const Room = () => {
    const params = useParams();

    const navigate = useNavigate();

    const [auth, setAuth, saveAuth] = useContext(AuthContext);

    const [room, setRoom] = useState({
        id: null
    });

    const [songQuery, setSongQuery] = useState({
        name: ''
    });

    const [roomSongs, setRoomSongs] = useState([]);

    const [spotifySearch, setSpotifySearch] = useState([]);
    const [nextSearchPage, setNextSearchPage] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            _getRoom();
        }, 5_000);

        const tokenInterval = setInterval(() => {
            spotifyOauth();
        }, 3_600_000);

        return() => {
            clearInterval(interval);
            clearInterval(tokenInterval);
        }
    }, []);

    const _getRoom = async () => {
        if (loading) {
            try {
                const res = await axios.get(`${apiHostUrl}/api/rooms/id/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                });

                const songs = await axios.get(`${apiHostUrl}/api/spotify/songs/room/id/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                });

                setRoom(res.data);
                setRoomSongs(songs.data);
                setLoading(false);

            } catch (err) {
                console.error(err.message ? err.message : err.response);

                // _leaveRoom();
            }
        }
    }

    const _updateAccessToken = async () => {
        spotifyOauth(room.id);
    }

    const _leaveRoom = async () => {
        try {
            const res = await axios.delete(`${apiHostUrl}/api/guest/delete/id/${auth.id}`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setAuth({
                id: null
            });

            saveAuth({
                id: null
            });

            localStorage.removeItem("stateKey");

            navigate("/");
        } catch (err) {
            console.error(err.response ? err.response : err.message);
        }
    }

    const _closeRoom = async () => {
        try {
            await axios.delete(`${apiHostUrl}/api/rooms/delete/id/${room.id}`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            _leaveRoom();
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    const _changeHost = async () => {
        const newHost = selectHost();
        if (newHost === null) {
            return;
        }

        _setNewHost(newHost);
    }

    const _setNewHost = async (newHost) => {
        try {
            const setNewHost = await axios.put(`${apiHostUrl}/api/rooms/update/host/${newHost}/guest/${room.host.id}/room/${room.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setRoom(setNewHost.data);
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    const selectHost = () => {
        const basicPrompt = "Enter the number next to the new Host\n0 to quit\n";
        let position = 1;

        const guestMap = room.guests.map(guest => {
            return `${position++}) ` + guest.id + "\n"
        });

        let selection = prompt(`${basicPrompt}${guestMap}`);

        if (selection === 0 || selection === null) {
            return null;
        }

        if (selection - 1 >= room.guests.length  || selection < 0) {
            alert('Invalid Selection, try again.');
            selectHost();
        } else {
            selection--;

            return room.guests[selection].id;
        }
    }

    const _searchSpotify = async () => {
        const parsedQuery = songQuery.name.replace(" ", "+");

        let song = 0;

        try {
            const res = await axios.get(`${spotifySearchUrl}q=${parsedQuery}&type=track`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`
                }
            });

            console.log(res.data.tracks.items);

            setSpotifySearch(res.data.tracks.items);
            setNextSearchPage(res.data.tracks.next);

            song = songSelectionPrompt();


        } catch (err) {
            console.error(err.messasge ? err.message : err.response);

            if (err.response && err.response.data.error.status === 401) {
                spotifyOauth();
            }
        }


        console.log(song);

        if (song != false) {
            _saveSongToRoom(song);
        }
    }

    const songSelectionPrompt = () => {
        const basicPrompt = "Enter the number next to the song you want to add.\nEnter 0 for next page.\n";
        let position = 1;

        const songMap = spotifySearch.map(song => {
            return `${position++}) ${song.name}: ${song.artists[0].name}\n`;
        });

        const selection = prompt(`${basicPrompt}${songMap}`);

        if (selection === null) {
            return null;
        } else if (selection === 0) {
            _nextSpotifyResultsPage()
        }

        if (selection - 1 >= spotifySearch.length  || selection < 0) {
            alert("Invalid selection, try again");
            songSelectionPrompt();
        } else {

            return spotifySearch[selection - 1];
        }

    }

    const _nextSpotifyResultsPage = async () => {
        try {
            const res = await axios.get(nextSearchPage, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`
                }
            });

            setSpotifySearch(res.data.tracks.items);
            setNextSearchPage(res.data.tracks.next);

            songSelectionPrompt();
        } catch (err) {
            console.error(err.response ? err.response : err.message);
        }
    }

    const _saveSongToRoom = async (song) => {

        const formattedSong = {
            name: song.name,
            spotifySongURL: song.id,
            room: {
                id: room.id
            }
        }

        console.log(formattedSong);

        try {
            const res = await axios.post(`${apiHostUrl}/api/spotify/songs`, formattedSong, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            console.log(res.data);
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }

    }

    const handleSearchChange = (e) => {
        setSongQuery({
            [e.target.id]: e.target.value
        });
    }

    const formatGuests = () => {
        //todo refactor with a guest component with buttons

        return(
                <Container style={{minHeight: '10em'}}>
                    <h2>Host:</h2>
                    <Guest
                        id={room.host.id}
                        isCurrentUser={room.host.id == auth.id}
                    />
                    <h3>Guests:</h3>

                    {
                        room.guests.map(guest => {
                            return <Guest
                                    id={guest.id}
                                    isCurrentUser={guest.id == auth.id}
                                    key={guest.id}
                                />
                        })
                    }

                    <h3>Songs:</h3>

                    {
                        roomSongs.map(song => {
                            //refactor to custom Song Component with buttons for the future
                            return <Song
                                    key={song.id}
                                    id={song.id}
                                    name={song.name}
                                    spotifySongURL={song.spotifySongURL}
                                />
                        })
                    }

                </Container>
            
            );
    }
    

    return(
        <Container style={{minHeight: '0em'}}>
            <h1>Room</h1>

            {loading ?
                        <h2>Loading...</h2>
                    :
                        <Container style={{minHeight: '0em'}}>
                            <h2>ID: {room.id}</h2>

                            <InlineInputContainer style={{width: '25%'}}>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Search By Song Name"
                                    value={songQuery.name}
                                    onChange={handleSearchChange}
                                    required
                                />
                                {/* TODO: Create the logic for when the button is clicked to search Spotify for query */}
                                <Button onClick={_searchSpotify}>Search Spotify</Button>
                            </InlineInputContainer>

                            {formatGuests()}

                            {auth.id == room.host.id ?
                                <Container style={{minHeight: '0em'}}>
                                    <Button
                                        style={{width: '10%'}}
                                        onClick={_changeHost}
                                    >Change Host</Button>
                                    <Button
                                        style={{width: '10%'}}
                                        onClick={_closeRoom}
                                    >Close Room</Button>
                                </Container>
                                :
                                <Button
                                    style={{width: '10%'}}
                                    onClick={_leaveRoom}
                                >Leave Room</Button>

                            }

                        </Container>

            }
        </Container>
    );
}

export default Room;