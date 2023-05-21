import React, {useState, useEffect} from "react";

const AuthContext = React.createContext([{}, () => {}, () => {}, () => {}]);

const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        id: null
    });

    const saveAuth = (newAuth) => {

        if (localStorage["Id"] != undefined) {
            localStorage.removeItem('Id');
        }
        
        localStorage.setItem('Id', JSON.stringify(newAuth.id));
    }

    const deleteAuth = () => {
        localStorage.removeItem('Id');
    }

    useEffect(() => {
        if (localStorage['Id'] != undefined) {
            setAuth({
                id: JSON.parse(localStorage['Id'])
            });
        }
    }, []);

    return(
        <AuthContext.Provider value={[auth, setAuth, saveAuth, deleteAuth]}>
            {props.children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider};