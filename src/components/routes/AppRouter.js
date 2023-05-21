import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../home/Home";

const AppRouter = () => {
    return(
        <div style={{width: '100%', flexDirection: 'column'}}>
            {/* navbar here */}
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </div>
    );
}

export default AppRouter;