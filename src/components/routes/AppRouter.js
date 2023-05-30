import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../home/Home";
import Room from "../room/Room";
import RoomSearch from "../room_search/RoomSearch";

const AppRouter = () => {
    return(
        <div style={{width: '100%', flexDirection: 'column'}}>
            {/* navbar here */}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/room/:id" element={<Room/>}/>
                <Route path="/room/search" element={<RoomSearch/>}/>
            </Routes>
        </div>
    );
}

export default AppRouter;