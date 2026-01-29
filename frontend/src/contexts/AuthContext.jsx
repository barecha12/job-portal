import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    role: null,
    setUser: () => { },
    setToken: () => { },
    setRole: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [role, _setRole] = useState(localStorage.getItem('USER_ROLE'));

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    const setRole = (role) => {
        _setRole(role);
        if (role) {
            localStorage.setItem('USER_ROLE', role);
        } else {
            localStorage.removeItem('USER_ROLE');
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            role,
            setUser,
            setToken,
            setRole
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useAuth = () => useContext(StateContext);
