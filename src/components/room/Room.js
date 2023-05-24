import React, { useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiHostUrl, loginToken} from "../config";
import { AuthContext } from "../providers/AuthProvider";
import Container from "../common/Container";

const Room = () => {
    const params = useParams();

    const [room, setRoom] = useState({
        id: params.id
    });

    const [loading, setLoading] = useState(true);

    const _getRoom = async () => {
        if (!loading) {
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

    _getRoom();
    console.log(room);

    

    return(
        <Container style={{minHeight: '0em'}}>
        </Container>
    );
}

export default Room;