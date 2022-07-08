import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: null,
    token: null,
    userId: null,
    loginContext: () => {},
    logoutContext: () => {}
});