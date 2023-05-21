import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiHostUrl, loginToken } from "../config";
import { AuthContext } from "../providers/AuthProvider";
import Container from "../common/Container";
import Button from "../common/Button";

const Home = () => {

    const [auth, setAuth, saveAuth] = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const [newGuest, setNewGuest] = useState({});

    useEffect(() => {
        const _deleteInactiveUser = async () => {
            if (auth.id == false) {
                try {
                    await axios.delete(
                        `${apiHostUrl}/api/guest/delete/id/${auth.id}`, {
                                headers: {
                                    Authorization: `Bearer: ${loginToken}`
                                }
                        }
                    );
    
                    setAuth({
                        id: null
                    });
    
                    saveAuth({
                        id: null
                    });
                } catch (err) {
                    console.error(err.message ? err.message : err.response);
                }
            }
        }

        _deleteInactiveUser();
    }, [auth, setAuth, saveAuth]);

    const _createGuestUser = async () => {
        try {
            const res = await axios.post(`${apiHostUrl}/api/guest`, {}, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });

            setNewGuest(res.data);

        } catch (err) {
            console.error(err.message ? err.message : err.response);
        }
        
    }

    const onCreateRoomClick = () => {
        _createGuestUser();
        //navigate to create room page
    }

    const onCreateGuestClick = () => {
        _createGuestUser();
        //navigate to join room page
    }

    return(
        <Container style={{minHeight: '0em'}}>
            <h1>Home</h1>

            <Container style={{minHeight: '0em', flexDirection: 'row', paddingTop: '10vh', justifyContent: 'center'}}>
                <Button 
                    style={{width: '25%'}}
                    onClick={onCreateRoomClick}
                    >Create Room</Button>
                <Button 
                    style={{width: '25%'}}
                    onClick={onCreateGuestClick}
                    >Join Room</Button>
            </Container>
        </Container>
    );
}

export default Home;