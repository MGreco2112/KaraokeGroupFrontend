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

    const [roomNum, setRoomNum] = useState({
        id: ''
    });

    const updateRoomNum = (e) => {

        if (document.getElementById('newSmall')) {
            document.removeChild('newSmall');
        }

        setRoomNum({
            id: e.target.value
        });
    }

    const validateId = (id) => {
        return /^\d+$/.test(id);
    }

    const _getRoom = async () => {

        if (validateId(roomNum.id)) {
                try {
                    const res = await axios.get(`${apiHostUrl}/api/rooms/id/${roomNum.id}`, {
                        headers: {
                            Authorization: `Bearer ${loginToken}`
                        }
                    });
        
                    _addGuestToRoom(res.data.id);
        
                } catch (err) {
                    console.error(err.message ? err.message : err.response);
                }
        } else {
            const div = document.getElementById('roomDiv');
            const newSmall = document.createElement('small');
            newSmall.id = 'newSmall';
            newSmall.innerHTML = 'Invalid Room ID, Try Again';
            div.appendChild(newSmall);
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
                value={roomNum.id}
                onChange={updateRoomNum}
                placeholder="Host's Room Number"
                required
            />
            <Button style={{width: '25%'}} onClick={_getRoom}>Search</Button>
        </Container>
    );
}

export default RoomSearch;