import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Null -> not logged in
    const [loading, setLoading] = useState(true);

    async function refreshMe() {
        setLoading(true);
        try {
            const data = await authApi.me();
            if (data.loggedIn) setUser(data.user);
            else setUser(null);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
    }

    useEffect(() => {
        refreshMe();
    }, []);

    const value = { user, loading, refreshMe, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export function useAuth() {

    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;

}