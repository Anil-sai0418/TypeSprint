import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getFullUserProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (email, token) => {
        try {
            const userData = await getFullUserProfile(email, token);
            if (userData) {
                // Handle structure differences if specific user object exists or is top-level
                setUser(userData.user || userData);
            } else {
                setUser({ email, name: email.split('@')[0] });
            }
        } catch (err) {
            console.error("Failed to fetch user profile", err);
            // Fallback if profile fetch fails but token exists
            setUser({ email, name: email.split('@')[0] });
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                const userEmail = localStorage.getItem("userEmail");

                if (token && userEmail) {
                    setIsAuthenticated(true);
                    await fetchUser(userEmail, token);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", email);
                setIsAuthenticated(true);
                await fetchUser(email, data.token);
                return { success: true, token: data.token };
            }
            return { success: false, message: data.message || "Login failed" };
        } catch (error) {
            return { success: false, message: error.message || "An error occurred" };
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register: apiRegister }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
