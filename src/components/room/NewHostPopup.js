import React from "react";
import Container from "../common/Container";
import Radio from "../common/Radio";


const NewHostPopup = (props) => {
    const {guests, prompt} = props.guests;

    let positon = 1;

    //return floating component containing the prompt, a map of guests, and an input field
    return(
        <Container style={{minHeight: '0em'}}>
            <h1>NewHostPopup</h1>
        </Container>
    );
}

export default NewHostPopup;