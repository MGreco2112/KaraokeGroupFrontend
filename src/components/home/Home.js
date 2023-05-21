import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { apiHostUrl, loginToken } from "../config";
import { AuthContext } from "../providers/AuthProvider";
import Container from "../common/Container";

const Home = () => {

    const [auth, setAuth, saveAuth] = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        const _deleteInactiveUser = async () => {
            if (auth.id != true) {
                try {
                    await axios.delete(
                        `${apiHostUrl}/api/guest/delete/id/${auth.id}`,
                        {}, {
                            headers: {
                                Authorization: `Bearer: ${loginToken}`
                            }
                        }
                    );
                } catch (err) {
                    console.error(err.message ? err.message : err.response);
                }
            }
        }

        const _createGuestUser = async () => {
            try {
                const res = await axios.post(`${apiHostUrl}/api/guest`, {}, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                });
    
                setAuth({
                    id: res.data.id
                });
    
                saveAuth({
                    id: res.data.id
                });
    
                setLoading(false);
            } catch (err) {
                console.error(err.message ? err.message : err.response);
            }
            
        }

        // setLoading(true);

        if (loading != false) {
            console.log(1);
            _deleteInactiveUser();
            console.log(2);
            _createGuestUser();
            console.log(3);
        }

        console.log(auth);
    }, [loading]);

    return(
        <h1>Home</h1>
    );
}

export default Home;