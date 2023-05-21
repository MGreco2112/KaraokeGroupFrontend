import React from "react";

const Splash = (props) => {

    const onClick = () => {
        if (props.onClick != undefined) {
            props.onClick(props.name);
        }
    }

    return (
        <div style={{...defaultStyle,
            ...props.style,
            backgroundImage: `url(${props.image})`}}
            onClick={onClick}
        >
            {props.children}
        </div>
    )
}

const defaultStyle = {
    backgroundSize: 'cover',
    height: '80vh',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    zIndex: 0,

}

export default Splash;