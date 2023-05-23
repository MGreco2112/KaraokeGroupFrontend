import React from "react";
import { useParams } from "react-router-dom";

const Room = () => {
    const params = useParams();

    console.log(params.id);

    return(
        <h1>Room</h1>
    );
}

export default Room;