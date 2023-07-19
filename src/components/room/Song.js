import React from "react";
import Container from "../common/Container";
import BorderCard from "../common/BorderCard";
import InlineInputContainer from "../common/InlineInputContainer";
import Button from "../common/Button";

const Song = (props) => {

    const {id, name, spotifySongURL} = props;

    const onClick = () => {
        //call backend to delete song from room
    }

    return(
        <Container style={{minHeight: '0em'}}>
            <BorderCard>
                <InlineInputContainer>
                    <p>{name}</p>
                    <Button>Remove</Button>
                </InlineInputContainer>
            </BorderCard>
        </Container>
    );
}

export default Song;