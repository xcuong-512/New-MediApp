import { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const fetchMe = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoadingUser(false);
            return;
        }

        try {
            setLoadingUser(true);
            const res = await meApi();
            // ApiResponse format {success, data}
            setUser(res.data || null);
        } catch (e) {
            // token invalid -> logout
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loadingUser, fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
