import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { apiHostUrl, loginToken } from "../config";
import Container from "../common/Container";
import Input from "../common/Input";
import Button from "../common/Button";


const RoomSearch = () => {
    const [auth] = useContext(AuthContext);
    const navigate = useNavigate();

    const [roomNum, setRoomNum] = useState();

    const updateRoomNum = (e) => {
        const value = e.target.value;

        console.log(parseInt(value));

        if (parseInt(value) !== NaN) {
            console.log(true);
            const parsedNum = parseInt(value);
    
            if (document.getElementById('warning')) {
                document.removeChild(document.getElementById('warning'));
            }
    
            setRoomNum(parsedNum);

        } else {
            const selDiv = document.getElementById('roomDiv');
            const newElement = document.createElement("small");
            newElement.id = "warning"
            newElement.innerText = "Invalid Room Number, Try Again"
            selDiv.appendChild(newElement);
        }


    }

    const _getRoom = async () => {
        try {
            const res = await axios.get(`${apiHostUrl}/api/rooms/id/${roomNum}`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            _addGuestToRoom(res.data.id);

        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    const _addGuestToRoom = async (roomId) => {
        try {
            const res = await axios.put(`${apiHostUrl}/api/rooms/add/guest/${auth.id}/room/${roomId}`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            navigate(`/room/${roomId}`);
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }


    return(
        <Container id="roomDiv" style={{minHeight: '0em'}}>
            <h1>Room Search</h1>
            <Input
                style={{width: '25%'}}
                name="roomNum"
                id="roomNum"
                value={roomNum}
                onChange={updateRoomNum}
                placeholder="Host's Room Number"
                required
            />
            <Button style={{width: '25%'}} onClick={_getRoom}>Search</Button>
        </Container>
    );
}

export default RoomSearch;