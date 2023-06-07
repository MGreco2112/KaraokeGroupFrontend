import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiHostUrl, loginToken} from "../config";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Guest from "../guest/Guest";
import Button from "../common/Button";
import Container from "../common/Container";

const Room = () => {
    const params = useParams();

    const navigate = useNavigate();

    const [auth, setAuth, saveAuth] = useContext(AuthContext);

    const [room, setRoom] = useState({
        id: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            _getRoom();
        }, 5_000);

        return() => clearInterval(interval);
    }, []);

    const _getRoom = async () => {
        if (loading) {
            try {
                const res = await axios.get(`${apiHostUrl}/api/rooms/id/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                });

                setRoom(res.data);
                setLoading(false);

            } catch (err) {
                console.error(err.message ? err.message : err.response);

                _leaveRoom();
            }
        }
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

        console.log(selection);

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
                        room.songs.map(song => {
                            //refactor to custom Song Component with buttons for the future
                            return <h3 key={song.id}>{song.id}</h3> 
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