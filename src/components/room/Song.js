import React from "react";
import Container from "../common/Container";

const Song = (props) => {

    const {id, name, spotifySongURL} = props;

    return(
        <Container style={{minHeight: '0em'}}>
            <p>{name}</p>
        </Container>
    );
}

export default Song;