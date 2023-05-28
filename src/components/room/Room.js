import React, { useState, useContext } from "react";
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
        const newHost = selectHost(); //write this function to pick guest

        try {
            const res = await axios.put(`${apiHostUrl}/api/rooms/update/host/${newHost}/room/${room.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setRoom(res.data);
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    _getRoom();

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