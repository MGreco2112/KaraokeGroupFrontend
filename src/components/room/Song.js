import React from "react";
import axios from "axios";
import Container from "../common/Container";
import BorderCard from "../common/BorderCard";
import InlineInputContainer from "../common/InlineInputContainer";
import Button from "../common/Button";
import { apiHostUrl, loginToken } from "../config";

const Song = (props) => {

    const {id, name, spotifySongURL, room, setRoom} = props;

    const onClick = async () => {
        try {
            const res = await axios.delete(`${apiHostUrl}/api/rooms/delete/song/id/${id}/room/id/${room}`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setRoom(res.data);
        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
    }

    return(
        <Container style={{minHeight: '0em'}}>
            <BorderCard>
                <InlineInputContainer>
                    <p>{name}</p>
                    <Button
                        onClick={onClick}
                    >Remove</Button>
                </InlineInputContainer>
            </BorderCard>
        </Container>
    );
}

export default Song;