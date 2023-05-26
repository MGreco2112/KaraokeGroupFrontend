import React from "react";
import BoarderCard from "../common/BorderCard";

const Guest = (props) => {

    const {id, isCurrentUser} = props;

    return(
        <BoarderCard>
            {isCurrentUser ?
                <p>(YOU)</p>
                :
                null
            }
            <p>Guest ID: {id}</p>
        </BoarderCard>
    );
}

export default Guest;