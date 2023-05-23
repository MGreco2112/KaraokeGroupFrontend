import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../home/Home";
import Room from "../room/Room";

const AppRouter = () => {
    return(
        <div style={{width: '100%', flexDirection: 'column'}}>
            {/* navbar here */}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/room/:id" element={<Room/>}/>
            </Routes>
        </div>
    );
}

export default AppRouter;