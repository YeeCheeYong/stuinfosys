import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const { createContext, useState } = require('react');

const AuthContext = createContext();

const AuthProvider = (props) => {
    const toast = useToast();
    const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')) || false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || false);
    const login = (userDetails) => {
        setLoggedIn(true);
        localStorage.setItem('loggedIn', JSON.stringify(true));
        setUser(userDetails);
        localStorage.setItem('user', JSON.stringify(userDetails));
    };

    const logout = () => {
        localStorage.setItem('loggedIn', JSON.stringify(false));
        setLoggedIn(false);
        window.localStorage.removeItem('user');
        setUser(null);
    };

    const logoutHandler = (e) => {
        logout();
        axios.post(`/api/v1/users/logout`).finally(() => <Navigate to="/" />);
    };
    const unAuthorizeHandler = (errCode) => {
        if (errCode === 401) {
            logoutHandler();
            toast({
                title: 'Your session is expired. Please login to continue!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            // return <Navigate to="/signin" />;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                login,
                logoutHandler,
                unAuthorizeHandler,
                user,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
