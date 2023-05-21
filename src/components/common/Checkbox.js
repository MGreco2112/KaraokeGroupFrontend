import React from "react";
import Container from "./Container";

const Checkbox = (props) => {
    return(
        <Container style={{minHeight: '10em'}}>
            <input
                style={{...style.input , ...props.style}}
                type="checkbox"
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                defaultChecked={props.checked}
            />
            <label
                htmlFor={props.id}
            >
                {props.label}
            </label>
        </Container>
    )
}

const style = {
    input: {
        color: "#000",
        backgroundColor: "#eee",
        paddingRight: 5,
        paddingLeft: 10,
        fontSize: 4,
        border: "1px solid #d9d9d9",
        width: "25px",
        height: "25px",
        minHeight: '10em',
        minWidth: 10,
        margin: 0,
        borderRadius: 5,
        flex: 1,
    },
}

export default Checkbox;